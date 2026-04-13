import { bizppurioFetch } from './client';
import { SendAlimtalkParams, SendAlimtalkResult, BizppurioMessagePayload } from './types';
import { BIZPPURIO_TEMPLATE_CODES, buildTemplateMessage } from './templates';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function sendAlimtalk(params: SendAlimtalkParams): Promise<SendAlimtalkResult> {
  const { to, templateCode, templateData, eventType, dedupeKey, userId } = params;

  // Supabase Service Role client for logging (bypasses RLS)
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  );

  let normalizedPhone = to;

  try {
    // 1. Check dedupe
    if (dedupeKey) {
      const { data: existingLog } = await supabase
        .from('message_logs')
        .select('id')
        .eq('dedupe_key', dedupeKey)
        .eq('status', 'success')
        .maybeSingle();

      if (existingLog) {
        console.log(`[Bizppurio] Skipping duplicate message for dedupe_key: ${dedupeKey}`);
        return { success: true, message: 'Skipped duplicate' };
      }
    }

    // 2. Normalize Phone Number
    normalizedPhone = to.replace(/[^0-9]/g, '');
    if (!normalizedPhone) {
      throw new Error('Invalid phone number format');
    }

    // 3. Prepare payload
    const senderKey = process.env.BIZPPURIO_SENDER_KEY;
    const accountId = process.env.BIZPPURIO_ACCOUNT_ID;
    
    if (!senderKey || !accountId) {
      throw new Error('Bizppurio configuration missing (.env)');
    }

    const contentStr = buildTemplateMessage(templateCode, templateData);

    const payload: BizppurioMessagePayload = {
      account: accountId,
      type: 'at',
      from: '0000000000', // Typically ignored for Kakao Alimtalk when senderkey is present, or must match center config
      to: normalizedPhone,
      content: {
        at: {
          senderkey: senderKey,
          templatecode: templateCode,
          message: contentStr,
        }
      },
      refkey: dedupeKey 
    };

    // 4. Send API
    const res = await bizppurioFetch('/v3/message', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    const success = data.code === 1000; // Bizppurio success code is 1000

    // 5. Save log
    await supabase.from('message_logs').insert({
      user_id: userId || null,
      event_type: eventType,
      recipient: normalizedPhone,
      template_code: templateCode,
      template_data: templateData || {},
      dedupe_key: dedupeKey,
      status: success ? 'success' : 'failed',
      response_code: data.code?.toString(),
      response_message: data.description,
      provider: 'bizppurio'
    });

    if (!success) {
      console.error('[Bizppurio] Send failed', data);
      return { success: false, code: data.code?.toString(), message: data.description };
    }

    return { success: true, messageId: data.messagekey };

  } catch (error: any) {
    console.error('[Bizppurio] Exception during send', error);
    
    // Log exception safely
    await supabase.from('message_logs').insert({
      user_id: userId || null,
      event_type: eventType,
      recipient: normalizedPhone || to,
      template_code: templateCode,
      template_data: templateData || {},
      dedupe_key: dedupeKey,
      status: 'failed',
      response_message: error.message,
      provider: 'bizppurio'
    });

    return { success: false, message: error.message };
  }
}

/**
 * Helper to send Welcome Message safely
 * Does not throw exception even if failed, so it doesn't break main flow.
 */
export async function sendSignupWelcomeAlimtalk({ userId, phoneNumber, name }: { userId: string, phoneNumber: string, name: string }) {
  try {
    await sendAlimtalk({
      userId,
      to: phoneNumber,
      templateCode: BIZPPURIO_TEMPLATE_CODES.SIGNUP_WELCOME,
      templateData: { name },
      eventType: 'signup_welcome',
      dedupeKey: `signup-welcome:${userId}`
    });
  } catch (err) {
    console.error('[Bizppurio] sendSignupWelcomeAlimtalk uncaught error:', err);
  }
}

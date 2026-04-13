import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { sendSignupWelcomeAlimtalk } from '@/lib/bizppurio'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/kyk/saving'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data?.session?.user) {
      const user = data.session.user;
      
      // Check if newly signed up (created within last 30s)
      const isNewUser = user.created_at && user.last_sign_in_at && 
        Math.abs(new Date(user.created_at).getTime() - new Date(user.last_sign_in_at).getTime()) < 30000;

      if (isNewUser) {
        const name = user.user_metadata?.full_name || user.user_metadata?.name || '고객';
        const phone = user.phone || user.user_metadata?.phone || user.user_metadata?.phone_number;
        
        if (phone) {
          await sendSignupWelcomeAlimtalk({
            userId: user.id,
            phoneNumber: phone,
            name
          });
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/kyk/gate?error=auth_failed`)
}

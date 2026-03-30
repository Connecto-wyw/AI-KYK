import { createClient } from '@/lib/supabase/server'
import { KID_PROFILES, KidType } from './scoring'

export interface AIContextResult {
  hasCompletedKYK: boolean;
  systemPromptInjection?: string;
  rawData?: any;
}

/**
 * Retrieves the KYK context for a specific user to inject into an LLM System Prompt.
 * @param userId - Supabase Auth User ID
 * @returns AIContextResult containing the formatted system prompt injection string
 */
export async function getKYKContext(userId: string): Promise<AIContextResult> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('kyk_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return { hasCompletedKYK: false }
  }

  const resultType = data.result_type as KidType
  const profile = KID_PROFILES[resultType]
  const answers = data.answers as any

  if (!profile) return { hasCompletedKYK: false }

  const childAge = answers?.step3?.ageGroup || 'Unknown'
  const parentConcern = answers?.step3?.concern || 'Unknown'

  const promptInjection = `
[USER CONTEXT: KYK PERSONALITY PROFILE]
The user is a parent of a child with the following KYK (Know Your Kid) personality profile:
- Child's Age Group: ${childAge}
- Personality Type: ${profile.title}
- Dominant Traits: ${profile.summary}

## Child's Strengths:
${profile.strengths.map(s => `- ${s}`).join('\n')}

## Care Points (Vulnerabilities/Behaviors to watch):
${profile.carePoints.map(c => `- ${c}`).join('\n')}

## Recommended Parental Approach:
${profile.approaches.map(a => `- ${a}`).join('\n')}

## Parent's Current Main Concern:
- ${parentConcern}

INSTRUCTION FOR COACH:
Always keep this context in mind. Frame your advice and questions to adapt to the child's specific personality type (${profile.title}) and the parent's current concern.
  `.trim()

  return {
    hasCompletedKYK: true,
    systemPromptInjection: promptInjection,
    rawData: data
  }
}

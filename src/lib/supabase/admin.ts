import { createClient } from '@supabase/supabase-js'

// WARNING: This client bypasses Row Level Security (RLS) entirely!
// It must only be used securely on the server-side to execute privileged operations.
// Never expose this client to the browser/frontend.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

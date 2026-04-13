-- message_logs (비즈뿌리오 알림톡 등 발송 로그 저장)
-- 이미 다른 테이블(profiles 등)이 있는 상태에서 이 테이블만 추가하기 위한 마이그레이션 스크립트입니다.

CREATE TABLE IF NOT EXISTS public.message_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  template_code TEXT NOT NULL,
  template_data JSONB,
  dedupe_key TEXT UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  response_code TEXT,
  response_message TEXT,
  provider TEXT NOT NULL DEFAULT 'bizppurio',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Row Level Security (RLS) 설정 제한 (서버 내부 로직에서만 사용하므로 클라이언트 노출 시도 차단)
ALTER TABLE public.message_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- AI-KYK 프리미엄 결과 잠금 해제 (Paywall) 마이그레이션
-- Supabase SQL Editor에서 실행하세요
-- ============================================================

-- 1. kyk_results 테이블 변경
ALTER TABLE kyk_results
  ADD COLUMN IF NOT EXISTS is_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS unlock_type TEXT CHECK (unlock_type IN ('none', 'ad_once', 'paid')),
  ADD COLUMN IF NOT EXISTS unlocked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS paid_order_id TEXT,
  ADD COLUMN IF NOT EXISTS premium_data JSONB; -- 구조화된 결과 저장용

-- 2. kyk_unlock_events 테이블생성 (진실의 원천)
CREATE TABLE IF NOT EXISTS kyk_unlock_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  result_id UUID REFERENCES kyk_results(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('ad', 'payment', 'admin')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 3. kyk_payments 테이블 생성 (결제 전용)
CREATE TABLE IF NOT EXISTS kyk_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  result_id UUID REFERENCES kyk_results(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  order_id TEXT UNIQUE NOT NULL,
  payment_key TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'KRW',
  status TEXT DEFAULT 'ready' CHECK (status IN ('ready', 'paid', 'failed', 'canceled', 'refunded')),
  raw_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

-- ============================================================
-- RLS 정책
-- ============================================================
ALTER TABLE kyk_unlock_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyk_payments ENABLE ROW LEVEL SECURITY;

-- 본인의 kyk_results만 조회 가능
-- 기존에 kyk_results RLS가 없다면 추가합니다.
-- ALTER TABLE kyk_results ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "kyk_results_select" ON kyk_results FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "kyk_unlock_events_select" ON kyk_unlock_events FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "kyk_unlock_events_insert" ON kyk_unlock_events FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "kyk_unlock_events_update" ON kyk_unlock_events FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "kyk_payments_select" ON kyk_payments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "kyk_payments_insert" ON kyk_payments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "kyk_payments_update" ON kyk_payments FOR UPDATE USING (user_id = auth.uid());

-- ============================================================
-- 팀 쇼핑 결제 마이그레이션
-- Supabase SQL Editor에서 실행하세요
-- ============================================================

-- 1. products 테이블
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name_ko TEXT NOT NULL,
  name_en TEXT,
  name_ms TEXT,
  name_id TEXT,
  name_vi TEXT,
  name_th TEXT,
  original_price INTEGER NOT NULL,       -- KRW
  team_price INTEGER NOT NULL,           -- KRW
  original_price_usd NUMERIC(10,2),      -- USD
  team_price_usd NUMERIC(10,2),          -- USD
  img TEXT,
  target_count INTEGER DEFAULT 3,
  discount_rate INTEGER DEFAULT 40,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO products (id, name_ko, name_en, original_price, team_price, original_price_usd, team_price_usd, img, target_count, discount_rate)
VALUES
  (1, '코리안 데일리 케어 에센스',  'Korean Daily Care Essence',    65000,  39000,  49.00, 29.00, '/img/items/item-1.png', 3, 40),
  (2, 'K-산후조리 스타터 키트',     'K-Postpartum Starter Kit',     124000, 74400,  94.00, 56.00, '/img/items/item-2.png', 3, 40),
  (3, '키즈 실리콘 식기 세트',      'Kids Silicone Tableware Set',  45000,  27000,  34.00, 20.00, '/img/items/item-3.png', 3, 40)
ON CONFLICT (id) DO NOTHING;

-- 2. teams 테이블
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) NOT NULL,
  captain_id UUID REFERENCES auth.users(id) NOT NULL,
  team_name TEXT NOT NULL,
  description TEXT,
  privacy TEXT DEFAULT 'public' CHECK (privacy IN ('public', 'private')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'full', 'expired', 'completed')),
  current_count INTEGER DEFAULT 0,
  target_count INTEGER DEFAULT 3,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. team_members 테이블
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('captain', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- 4. orders 테이블
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  team_id UUID REFERENCES teams(id),
  product_id INTEGER REFERENCES products(id) NOT NULL,
  amount INTEGER NOT NULL,            -- 실제 결제 금액
  currency TEXT DEFAULT 'KRW',        -- 'KRW' or 'USD'
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_gateway TEXT NOT NULL CHECK (payment_gateway IN ('toss', 'stripe')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. payments 테이블
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) NOT NULL,
  gateway TEXT NOT NULL CHECK (gateway IN ('toss', 'stripe')),
  gateway_payment_id TEXT,            -- toss: paymentKey / stripe: payment_intent_id
  gateway_order_id TEXT UNIQUE,       -- toss: orderId / stripe: checkout_session_id
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  raw_response JSONB,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RLS 정책
-- ============================================================

ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams       ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments    ENABLE ROW LEVEL SECURITY;

-- products: 누구나 읽기 가능
CREATE POLICY "products_select" ON products FOR SELECT USING (true);

-- teams: public 팀은 누구나, private 팀은 팀장/팀원만
CREATE POLICY "teams_select" ON teams FOR SELECT
  USING (privacy = 'public' OR captain_id = auth.uid()
    OR id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));
CREATE POLICY "teams_insert" ON teams FOR INSERT WITH CHECK (captain_id = auth.uid());
CREATE POLICY "teams_update" ON teams FOR UPDATE USING (true); -- service role 사용

-- team_members: 누구나 읽기, 본인만 삽입
CREATE POLICY "team_members_select" ON team_members FOR SELECT USING (true);
CREATE POLICY "team_members_insert" ON team_members FOR INSERT WITH CHECK (user_id = auth.uid());

-- orders: 본인 주문만
CREATE POLICY "orders_select" ON orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (user_id = auth.uid());

-- payments: 본인 주문의 결제 내역만
CREATE POLICY "payments_select" ON payments FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

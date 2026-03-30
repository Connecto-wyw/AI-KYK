-- =======================================================
-- KYK (Know Your Kids) - Supabase Database Schema
-- =======================================================

-- 1. profiles (부모 계정)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. kids (아이 프로필 및 설문 결과)
CREATE TABLE public.kids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT, -- 나중에 이름 입력 기능 추가를 대비
  birth_year TEXT,
  gender TEXT,
  region TEXT,
  main_concern TEXT,
  kyk_result_type TEXT,
  raw_answers JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. coach_chats (전체 대화 로그)
CREATE TABLE public.coach_chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kid_id UUID REFERENCES public.kids(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. kid_memories (AI 핵심 기억 / RAG 요약)
-- 대화가 쌓이면 AI가 과거를 기억할 수 있도록 요약본을 덮어씁니다.
CREATE TABLE public.kid_memories (
  kid_id UUID REFERENCES public.kids(id) ON DELETE CASCADE PRIMARY KEY,
  summary_context TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =======================================================
-- Row Level Security (RLS) 설정 
-- (자신의 데이터만 안전하게 읽고 쓸 수 있도록 권한 제어)
-- =======================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kid_memories ENABLE ROW LEVEL SECURITY;

-- 부모(Profiles): 본인 정보 권한
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 아이(Kids): 부모 소유 권한
CREATE POLICY "Users can view own kids" ON public.kids FOR SELECT USING (parent_id = auth.uid());
CREATE POLICY "Users can insert own kids" ON public.kids FOR INSERT WITH CHECK (parent_id = auth.uid());
CREATE POLICY "Users can update own kids" ON public.kids FOR UPDATE USING (parent_id = auth.uid());
CREATE POLICY "Users can delete own kids" ON public.kids FOR DELETE USING (parent_id = auth.uid());

-- 채팅(Chats): 부모를 통한 접근 권한
CREATE POLICY "Users can view own kids' chats" ON public.coach_chats FOR SELECT USING (
  kid_id IN (SELECT id FROM public.kids WHERE parent_id = auth.uid())
);
CREATE POLICY "Users can insert own kids' chats" ON public.coach_chats FOR INSERT WITH CHECK (
  kid_id IN (SELECT id FROM public.kids WHERE parent_id = auth.uid())
);

-- 요약(Memories): 부모를 통한 접근 권한
CREATE POLICY "Users can view own kids' memories" ON public.kid_memories FOR SELECT USING (
  kid_id IN (SELECT id FROM public.kids WHERE parent_id = auth.uid())
);
CREATE POLICY "Users can insert/update own kids' memories" ON public.kid_memories FOR ALL USING (
  kid_id IN (SELECT id FROM public.kids WHERE parent_id = auth.uid())
);

-- =======================================================
-- Trigger: 구글 회원가입 시 자동으로 Profiles 테이블에 유저 생성
-- =======================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

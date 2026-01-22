-- Hackify Database Schema
-- Ethical Hacking Learning Platform

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Hacker',
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  xp INTEGER NOT NULL DEFAULT 0,
  rank_title TEXT NOT NULL DEFAULT 'Script Kiddie',
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  thumbnail_url TEXT,
  difficulty_level TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chapters table
CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_path TEXT,
  video_url TEXT,
  duration INTEGER NOT NULL DEFAULT 0,
  xp_reward INTEGER NOT NULL DEFAULT 50,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Progress tracking table
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  watch_time INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Orders table (for course purchases)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  payment_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Courses RLS Policies (public read, admin write)
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (is_published = true OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can insert courses" ON public.courses FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update courses" ON public.courses FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete courses" ON public.courses FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Chapters RLS Policies
CREATE POLICY "Anyone can view chapters" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Admins can manage chapters" ON public.chapters FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Videos RLS Policies
CREATE POLICY "Anyone can view videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Admins can manage videos" ON public.videos FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Progress RLS Policies
CREATE POLICY "Users can view their own progress" ON public.progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.progress FOR UPDATE USING (auth.uid() = user_id);

-- Orders RLS Policies
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Settings RLS Policies (admin only)
CREATE POLICY "Admins can manage settings" ON public.settings FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Anyone can read settings" ON public.settings FOR SELECT USING (true);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'Hacker'),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create trigger for auto-profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate rank based on XP
CREATE OR REPLACE FUNCTION public.get_rank_title(xp_points INTEGER)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN CASE
    WHEN xp_points >= 10000 THEN 'Elite Hacker'
    WHEN xp_points >= 5000 THEN 'Black Hat'
    WHEN xp_points >= 2500 THEN 'Grey Hat'
    WHEN xp_points >= 1000 THEN 'White Hat'
    WHEN xp_points >= 500 THEN 'Penetration Tester'
    WHEN xp_points >= 100 THEN 'Code Breaker'
    ELSE 'Script Kiddie'
  END;
END;
$$;

-- Function to update XP and rank
CREATE OR REPLACE FUNCTION public.award_xp(p_user_id UUID, p_xp INTEGER)
RETURNS TABLE(new_xp INTEGER, new_rank TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_xp INTEGER;
  v_new_rank TEXT;
BEGIN
  UPDATE public.profiles
  SET xp = xp + p_xp,
      rank_title = public.get_rank_title(xp + p_xp),
      updated_at = NOW()
  WHERE id = p_user_id
  RETURNING xp, rank_title INTO v_new_xp, v_new_rank;
  
  RETURN QUERY SELECT v_new_xp, v_new_rank;
END;
$$;

-- Insert default settings
INSERT INTO public.settings (key, value) VALUES
  ('site_maintenance_mode', 'false'),
  ('site_name', 'Hackify'),
  ('site_tagline', 'Master the Art of Ethical Hacking')
ON CONFLICT (key) DO NOTHING;

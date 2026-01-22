-- Add slug column to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Add level column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS level INTEGER NOT NULL DEFAULT 1;

-- Update existing courses with slugs based on title
UPDATE public.courses 
SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Run this in your Supabase SQL Editor

create table public.tutor_profiles (
  id uuid references public.profiles(id) primary key,
  full_name text not null,
  permanent_address text not null,
  present_address text not null,
  contact text not null,
  education_qualification text not null,
  experience text not null,
  student_id_url text,
  college_university text not null,
  nid text not null,
  subjects text[],
  class_levels text[],
  medium text,
  teaching_areas jsonb,
  expected_salary integer,
  bio text,
  demo_class_link text,
  profile_complete boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.tutor_profiles enable row level security;

create policy "Tutors manage own profile"
  on public.tutor_profiles for all
  using (auth.uid() = id);

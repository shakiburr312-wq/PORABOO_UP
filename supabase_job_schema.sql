-- Run this in your Supabase SQL Editor

create table public.job_posts (
  id uuid default gen_random_uuid() primary key,
  guardian_id uuid references public.profiles(id) not null,
  subjects text[] not null,
  class_level text not null,
  medium text not null,
  days_per_week text not null,
  time_preference text[],
  thana text not null,
  sub_area text,
  budget_min integer,
  budget_max integer,
  notes text,
  gender_preference text default 'any',
  status text default 'open' 
    check (status in ('open', 'assigned', 'closed')),
  created_at timestamp with time zone default now()
);

create table public.job_applications (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.job_posts(id) not null,
  tutor_id uuid references public.profiles(id) not null,
  cover_note text,
  status text default 'pending'
    check (status in ('pending', 'shortlisted', 'rejected', 'assigned')),
  applied_at timestamp with time zone default now(),
  unique(job_id, tutor_id)
);

alter table public.job_posts enable row level security;
alter table public.job_applications enable row level security;

-- Guardians manage own posts
create policy "Guardians manage own posts"
  on public.job_posts for all
  using (auth.uid() = guardian_id);

-- Everyone can view open posts
create policy "Anyone can view open posts"
  on public.job_posts for select
  using (status = 'open');

-- Tutors can apply
create policy "Tutors can apply"
  on public.job_applications for insert
  using (auth.uid() = tutor_id);

-- Tutors see own applications
create policy "Tutors see own applications"
  on public.job_applications for select
  using (auth.uid() = tutor_id);

-- Guardians see applications for their posts
create policy "Guardians see their post applications"
  on public.job_applications for select
  using (
    auth.uid() = (
      select guardian_id from public.job_posts 
      where id = job_id
    )
  );

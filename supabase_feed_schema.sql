create table public.posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) not null,
  content text,
  media_urls text[],
  media_type text check (
    media_type in ('image','video',null)
  ),
  visibility text default 'public' check (
    visibility in ('public','tutors_only','guardians_only')
  ),
  is_flagged boolean default false,
  created_at timestamp with time zone default now()
);

create table public.post_likes (
  post_id uuid references public.posts(id) 
    on delete cascade,
  user_id uuid references public.profiles(id),
  primary key (post_id, user_id)
);

create table public.post_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) 
    on delete cascade not null,
  author_id uuid references public.profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default now()
);

create table public.tutor_connections (
  id uuid default gen_random_uuid() primary key,
  requester_id uuid references public.profiles(id),
  receiver_id uuid references public.profiles(id),
  status text default 'pending' check (
    status in ('pending','accepted','rejected')
  ),
  created_at timestamp with time zone default now(),
  unique(requester_id, receiver_id)
);

-- RLS
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.tutor_connections enable row level security;

create policy "View public posts"
  on public.posts for select
  using (auth.uid() is not null 
    and visibility = 'public'
    or author_id = auth.uid());

create policy "Manage own posts"
  on public.posts for all
  using (auth.uid() = author_id);

create policy "Like posts"
  on public.post_likes for all
  using (auth.uid() = user_id);

create policy "Comment on posts"
  on public.post_comments for all
  using (auth.uid() is not null);

create policy "Manage connections"
  on public.tutor_connections for all
  using (auth.uid() = requester_id 
    or auth.uid() = receiver_id);

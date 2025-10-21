-- Supabase SQL schema for JD Marc Construction
-- Tables: users (profile), departments, tasks, messages
-- Add this file to Supabase SQL editor or run via psql with service role key

-- users table (profiles, separate from auth.users)
create table if not exists public.users (
  id uuid default gen_random_uuid() primary key,
  auth_id uuid not null unique,
  email text not null,
  role text not null default 'user',
  department text,
  created_at timestamptz default now()
);

create index if not exists idx_users_auth_id on public.users (auth_id);

-- departments
create table if not exists public.departments (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  code text not null unique
);

-- tasks
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  status text not null default 'open',
  assigned_to uuid references public.users(id) on delete set null,
  created_at timestamptz default now()
);

-- messages
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.users(id) on delete cascade,
  receiver_id uuid references public.users(id) on delete cascade,
  message_text text not null,
  created_at timestamptz default now()
);

-- contacts (contact form submissions)
create table if not exists public.contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  company text,
  subject text,
  message text,
  project_type text,
  budget text,
  timeline text,
  location text,
  source text,
  status text default 'new',
  created_at timestamptz default now()
);

-- testimonials
create table if not exists public.testimonials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  company text,
  position text,
  location text,
  rating int,
  testimonial text,
  project_name text,
  project_value text,
  project_duration text,
  approved boolean default false,
  featured boolean default false,
  created_at timestamptz default now()
);

-- Row-level security examples
-- Enable RLS on tables to allow fine-grained access
alter table public.users enable row level security;
alter table public.tasks enable row level security;
alter table public.messages enable row level security;
alter table public.contacts enable row level security;
alter table public.testimonials enable row level security;

-- Allow authenticated users to read their own profile
create policy "users_select_own" on public.users
  for select using (auth.role() = 'authenticated' and auth.uid()::uuid = auth_id);

-- Allow admins to manage users
create policy "users_admin_manage" on public.users
  for all using (
    (select role from public.users where auth_id = auth.uid()) = 'admin'
  ) with check (
    (select role from public.users where auth_id = auth.uid()) = 'admin'
  );

-- Tasks: allow assigned user or admin to read/write
create policy "tasks_read_assigned_or_admin" on public.tasks
  for select using (
    auth.role() = 'authenticated' and (
      assigned_to::text = (select id::text from public.users where auth_id = auth.uid())
      or exists (select 1 from public.users u where u.auth_id = auth.uid() and u.role = 'admin')
    )
  );

create policy "tasks_insert_authenticated" on public.tasks
  for insert with check (auth.role() = 'authenticated');

-- Messages: allow sender or receiver to read
create policy "messages_read_participants" on public.messages
  for select using (
    auth.role() = 'authenticated' and (
      sender_id::text = (select id::text from public.users where auth_id = auth.uid())
      or receiver_id::text = (select id::text from public.users where auth_id = auth.uid())
    )
  );

create policy "messages_insert_authenticated" on public.messages
  for insert with check (auth.role() = 'authenticated');

-- Contacts: allow anyone to insert (public contact form) but only authenticated can view
create policy "contacts_insert_public" on public.contacts
  for insert with check (true);

create policy "contacts_select_authenticated" on public.contacts
  for select using (auth.role() = 'authenticated');

-- Testimonials: allow public insert, admin moderation to update
create policy "testimonials_insert_public" on public.testimonials
  for insert with check (true);

create policy "testimonials_select_public" on public.testimonials
  for select using (true);

-- analytics table (basic event tracking)
create table if not exists public.analytics (
  id uuid default gen_random_uuid() primary key,
  event text not null,
  data jsonb,
  user_id uuid,
  created_at timestamptz default now()
);

alter table public.analytics enable row level security;
create policy "analytics_insert_authenticated" on public.analytics
  for insert with check (auth.role() = 'authenticated' or auth.role() = 'anonymous');

-- notifications table
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  title text,
  body text,
  read boolean default false,
  metadata jsonb,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;
create policy "notifications_for_user" on public.notifications
  for select using (auth.role() = 'authenticated' and user_id::text = (select id::text from public.users where auth_id = auth.uid()));
create policy "notifications_insert_authenticated" on public.notifications
  for insert with check (auth.role() = 'authenticated');

-- Use CREATE OR REPLACE FUNCTION for portability
create or replace function public.handle_auth_user_created() returns trigger language plpgsql security definer as $$
begin
  -- Insert a profile in public.users when a new auth user is created
  insert into public.users (auth_id, email, created_at)
  values (new.id, new.email, now())
  on conflict (auth_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_auth_user_created();

-- Note: The policies above assume a mapping between auth.uid() and public.users.auth_id.
-- You may need to adjust policies to match your Supabase project's auth schema or use trigger-based sync.

-- RPC: get_user_analytics(user_uuid uuid)
create or replace function public.get_user_analytics(p_user_id uuid)
returns table(id uuid, event text, data jsonb, user_id uuid, created_at timestamptz)
language sql security definer as $$
  select id, event, data, user_id, created_at from public.analytics where user_id = p_user_id order by created_at desc;
$$;

-- RPC: get_lead_scoring()
create or replace function public.get_lead_scoring()
returns table(status text, count bigint)
language sql security definer as $$
  select status, count(*) from public.contacts group by status order by count desc;
$$;

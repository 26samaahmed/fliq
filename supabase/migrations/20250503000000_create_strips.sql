-- Run this in your Supabase SQL editor, then create a storage bucket named "strips" set to public.

create table public.strips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  storage_path text not null,
  mime_type text not null default 'image/png',
  created_at timestamptz default now() not null
);

alter table public.strips enable row level security;

create policy "Users can view own strips"
  on public.strips for select
  using (auth.uid() = user_id);

create policy "Users can insert own strips"
  on public.strips for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own strips"
  on public.strips for delete
  using (auth.uid() = user_id);

-- Storage policies (bucket must be created manually in the Supabase dashboard as a PUBLIC bucket named "strips")
insert into storage.buckets (id, name, public) values ('strips', 'strips', true)
  on conflict (id) do nothing;

create policy "Users can upload own strips"
  on storage.objects for insert
  with check (bucket_id = 'strips' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Public can view strips"
  on storage.objects for select
  using (bucket_id = 'strips');

create policy "Users can delete own strips"
  on storage.objects for delete
  using (bucket_id = 'strips' and auth.uid()::text = (storage.foldername(name))[1]);

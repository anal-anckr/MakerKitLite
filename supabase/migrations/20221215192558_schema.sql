create type subscription_status as ENUM (
  'active',
  'trialing',
  'past_due',
  'canceled',
  'unpaid',
  'incomplete',
  'incomplete_expired',
  'paused'
);

create table users (
  id uuid references auth.users not null,
  photo_url text,
  display_name text,
  created_at timestamptz not null default now(),
  primary key (id)
);

create table subscriptions (
  id text not null primary key,
  price_id text not null,
  status subscription_status not null,
  cancel_at_period_end bool not null,
  currency text,
  interval text,
  interval_count int,
  created_at timestamptz not null,
  period_starts_at timestamptz not null,
  period_ends_at timestamptz not null,
  trial_starts_at timestamptz,
  trial_ends_at timestamptz,
  user_id uuid not null references public.users (id) on delete cascade
);

create table customers_subscriptions (
  id bigint generated always as identity primary key,
  customer_id text unique not null,
  user_id uuid not null references public.users (id) on delete cascade,
  subscription_id text unique references public.subscriptions (id) on delete
  set null
);

insert into storage.buckets (id, name, PUBLIC)
  values ('avatars', 'avatars', true);

alter table users enable row level security;

alter table subscriptions enable row level security;

alter table customers_subscriptions enable row level security;

-- inserts a row into public.users
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, display_name, photo_url)
  values (new.id, new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data
  ->> 'photo_url');
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create policy "Users can read and update data belonging only their records" on
users
  for all
    using (auth.uid () = users.id)
    with check (auth.uid () = users.id);

create policy "Users can only read their own subscriptions" on
subscriptions
  for select
    using (auth.uid () = user_id);

create policy "Users can only read their own customers subscriptions" on
customers_subscriptions
  for select
    using (auth.uid () = user_id);

create policy "Avatars can be read and written only by the user that owns the
  avatar" on storage.objects
  for all
    using (bucket_id = 'avatars'
      and (replace(storage.filename (name), concat('.', storage.extension (name)), '')::uuid) = auth.uid ())
      with check (bucket_id = 'avatars'
      and (replace(storage.filename (name), concat('.', storage.extension (name)), '')::uuid) = auth.uid ());

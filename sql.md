-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  fullName text unique,
  email text,
  avatar_url text,
  phone text,
  streetAddress text, 
  city text, 
  country text,
  postCode text, 
  role text, 
  qualifications text,

  constraint username_length check (char_length(username) >= 3)
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

CREATE POLICY "Public profiles are viewable by the User." 
ON profiles
  FOR SELECT
  USING (auth.uid() = Id);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, fullname, avatar_url, email, phone)
  values (new.id, new.raw_user_meta_data->>'fullname', new.raw_user_meta_data->>'avatar_url', new.email, new.phone);
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');


-- Create the bookings table
CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  details TEXT,
  startTime TIMESTAMP NOT NULL,
  endTime TIMESTAMP NOT NULL,
  userId UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (userId) REFERENCES auth.users (id) ON DELETE CASCADE
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table bookings
  enable row level security;

create policy "Public bookings are viewable by everyone." on bookings
  for select using (true);

create policy "Users can update own bookings." on bookings
  for update using ((select auth.uid()) = userid);


-- Create the logs table
create table aircraft (
  id BIGSERIAL PRIMARY KEY,
  aircraft TEXT NOT NULL unique ON UPDATE CASCADE,
  model TEXT NOT NULL

);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table aircraft
  enable row level security;


-- Create the logs table
create table logs (
  id BIGSERIAL PRIMARY KEY,
  userId UUID NOT NULL,
  aircraft TEXT NOT NULL,
  date DATE NOT NULL,
  PIC TEXT NOT NULL,
  peopleonboard INT NOT NULL,
  departure TEXT NOT NULL,
  arrival TEXT NOT NULL,
  offblock TIMESTAMP NOT NULL,
  takeoff TIMESTAMP NOT NULL,
  landing TIMESTAMP NOT NULL,
  onblock TIMESTAMP NOT NULL,
  landings INT NOT NULL DEFAULT 1,
  flightrules TEXT NOT NULL DEFAULT 'VFR',
  night TEXT DEFAULT NULL,
  ir TEXT DEFAULT NULL,
  fuel FLOAT NOT NULL,
  flight_type TEXT NOT NULL DEFAULT 'Local',
  details TEXT,
  billing_details TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (userId) REFERENCES auth.users (id),
  FOREIGN KEY (aircraft) REFERENCES aircraft (aircraft),
  FOREIGN KEY (PIC) REFERENCES profiles (fullName)
);

-- Enable Row-Level Security (RLS) on the logs table
ALTER TABLE logs
  ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to view their own logs
CREATE POLICY "Public logs are viewable by the User." 
ON logs
  FOR SELECT
  USING (auth.uid() = userId);

-- Policy: Allow users to update their own logs
CREATE POLICY "Users can update their own logs."
ON logs
  FOR UPDATE
  USING (auth.uid() = userId);

-- Additional Policy: Restrict updates to logs from the previous month
CREATE POLICY "Users can only update logs from the previous month."
ON logs
  FOR UPDATE
  USING (
    auth.uid() = userId
    AND created_at >= DATE_TRUNC('month', NOW()) - INTERVAL '1 month'
    AND created_at < DATE_TRUNC('month', NOW())
  );

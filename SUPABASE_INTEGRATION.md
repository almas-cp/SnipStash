# Supabase Integration Guide for SnipStash

## Setting Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Note your project URL and anon key from the API settings.
3. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## Database Schema

Run the following SQL in the Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create snippets table
CREATE TABLE snippets (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  language TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert users data
INSERT INTO users (id, email, password, name, created_at, updated_at)
VALUES
  ('7df7dc0e-211f-437c-87e9-56522755b3b6', 'almascp11@gmail.com', '$2a$10$fBl91y6dztJcVT7Sk.Cmt.2u923TGbXqxybUfE0YAzu8DwBc98mFS', 'ALMAS CP', '2025-04-26T10:13:43.743Z', '2025-04-26T10:13:43.743Z'),
  ('79691a6a-3be9-44ea-beaa-46211875b845', 'almascp22@gmail.com', '$2a$10$vUUC9ElOb9ZRp.SDvj6mduoLYvm/OmzLFQdUXp1K6hyDFHXEZXxr2', 'almas22', '2025-04-26T10:14:11.137Z', '2025-04-26T10:14:11.137Z');
```

## Row Level Security (RLS)

Enable Row Level Security for both tables and create the following policies:

### Users Table Policies

```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data only
CREATE POLICY "Users can read their own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### Snippets Table Policies

```sql
-- Enable RLS on snippets table
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own snippets
CREATE POLICY "Users can read their own snippets" ON snippets
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own snippets
CREATE POLICY "Users can insert their own snippets" ON snippets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own snippets
CREATE POLICY "Users can update their own snippets" ON snippets
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own snippets
CREATE POLICY "Users can delete their own snippets" ON snippets
  FOR DELETE USING (auth.uid() = user_id);
```

## Authentication

The app uses NextAuth.js with Supabase as the data storage. The authentication flow is:

1. User signs in with email/password
2. Credentials are verified against the `users` table in Supabase
3. If valid, a JWT is created and stored in a cookie
4. The JWT is used to authenticate subsequent requests

## API Routes

All API routes in `app/api/*` now use Supabase for data storage.

## Deployment

When deploying:

1. Set up environment variables on your hosting platform
2. Ensure your Supabase project has the correct CORS settings to allow requests from your deployed domain
3. If using Vercel, you can add the environment variables in the Vercel dashboard 
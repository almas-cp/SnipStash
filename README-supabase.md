# Supabase Integration for SnipStash

This document explains how to setup and configure Supabase for SnipStash.

## Setup Steps

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com) and sign up/login
   - Create a new project and note your project URL and anon key

2. **Configure Environment Variables**
   - Copy the `.env.example` to `.env.local`
   - Fill in your Supabase URL and anon key:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```

3. **Create Database Tables**
   - Go to the SQL Editor in your Supabase dashboard
   - Run the following SQL to create the required tables:

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
```

4. **Set Up Row Level Security (Optional but Recommended)**
   - Enable Row Level Security (RLS) for both tables
   - Create policies to ensure users can only access their own data

5. **Seed Initial Data (Optional)**
   - Use the SQL editor to add initial user data:

```sql
-- Insert users data (example)
INSERT INTO users (id, email, password, name, created_at, updated_at)
VALUES
  ('7df7dc0e-211f-437c-87e9-56522755b3b6', 'almascp11@gmail.com', '$2a$10$fBl91y6dztJcVT7Sk.Cmt.2u923TGbXqxybUfE0YAzu8DwBc98mFS', 'ALMAS CP', '2025-04-26T10:13:43.743Z', '2025-04-26T10:13:43.743Z'),
  ('79691a6a-3be9-44ea-beaa-46211875b845', 'almascp22@gmail.com', '$2a$10$vUUC9ElOb9ZRp.SDvj6mduoLYvm/OmzLFQdUXp1K6hyDFHXEZXxr2', 'almas22', '2025-04-26T10:14:11.137Z', '2025-04-26T10:14:11.137Z');
```

## API Usage

The app now uses Supabase for data storage. The integration is abstracted in the `lib/db.ts` file, so you can use the same API functions to interact with your data.

## Troubleshooting

- **Authentication Issues**: Make sure your Supabase anon key has the correct permissions
- **Database Errors**: Check console logs for specific error messages from Supabase
- **CORS Errors**: Configure CORS in your Supabase project settings if needed 
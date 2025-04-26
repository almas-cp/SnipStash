import { supabase, createSupabaseClient } from './supabase';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './utils';

// Types for our data
export type User = {
  id: string;
  email: string;
  password: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
};

export type Snippet = {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  tags?: string[] | string;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

// User-related functions
export const userDb = {
  findUnique: async (where: { email?: string; id?: string }): Promise<User | null> => {
    // Create a fresh client for this request
    const client = createSupabaseClient();
    let query = client.from('users').select('*');
    
    if (where.email) {
      query = query.eq('email', where.email);
    } else if (where.id) {
      query = query.eq('id', where.id);
    } else {
      return null;
    }
    
    const { data, error } = await query.single();
    
    if (error || !data) {
      return null;
    }
    
    return {
      id: data.id,
      email: data.email,
      password: data.password,
      name: data.name,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  create: async (data: { email: string; password: string; name?: string }): Promise<User> => {
    // Create a fresh client for this request
    const client = createSupabaseClient();
    logger.info(`Creating user with email: ${data.email}`);
    
    try {
      // Check if user already exists
      logger.debug(`Checking if user exists: ${data.email}`);
      const { data: existingUser, error: checkError } = await client
        .from('users')
        .select('*')
        .eq('email', data.email)
        .single();
      
      if (checkError && !checkError.message.includes('No rows found')) {
        logger.error('Error checking for existing user', checkError);
        throw new Error(`Failed to check existing user: ${checkError.message || 'Unknown error'}`);
      }
      
      if (existingUser) {
        logger.warn(`User already exists: ${data.email}`);
        throw new Error('User with this email already exists');
      }
      
      // Hash password
      logger.debug('Hashing password');
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      const userId = uuidv4();
      const now = new Date().toISOString();
      
      logger.debug(`Creating user in database: ${userId}`);
      
      // Insert with improved error handling
      const { data: newUser, error } = await client
        .from('users')
        .insert({
          id: userId,
          email: data.email,
          password: hashedPassword,
          name: data.name || 'User',
          created_at: now,
          updated_at: now
        })
        .select()
        .single();
      
      if (error) {
        logger.error('Failed to create user', error);
        throw new Error(`Failed to create user: ${error.message || 'Unknown error'}`);
      }
      
      if (!newUser) {
        logger.error('No user data returned after insert');
        throw new Error('Failed to create user: No data returned');
      }
      
      logger.info(`User created successfully: ${userId}`);
      
      return {
        id: newUser.id,
        email: newUser.email,
        password: newUser.password,
        name: newUser.name,
        createdAt: newUser.created_at,
        updatedAt: newUser.updated_at
      };
    } catch (error) {
      logger.error('Exception during user creation', error);
      // Rethrow with clear error message
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Failed to create user: ${JSON.stringify(error)}`);
      }
    }
  }
};

// Snippet-related functions
export const snippetDb = {
  findMany: async (where?: { userId?: string }): Promise<Snippet[]> => {
    // Create a fresh client for this request
    const client = createSupabaseClient();
    let query = client.from('snippets').select('*');
    
    if (where?.userId) {
      query = query.eq('user_id', where.userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching snippets:", error);
      return [];
    }
    
    // Ensure data is an array before using map
    if (!data || !Array.isArray(data)) {
      console.warn("No snippets found or invalid data format:", data);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      title: item.title,
      code: item.code,
      description: item.description,
      language: item.language,
      tags: Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : []),
      userId: item.user_id,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  },
  
  findUnique: async (where: { id: string }): Promise<Snippet | null> => {
    // Create a fresh client for this request
    const client = createSupabaseClient();
    const { data, error } = await client
      .from('snippets')
      .select('*')
      .eq('id', where.id)
      .single();
      
    if (error || !data) {
      return null;
    }
    
    return {
      id: data.id,
      title: data.title,
      code: data.code,
      description: data.description,
      language: data.language,
      tags: data.tags,
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },
  
  create: async (data: {
    title: string;
    code: string;
    description?: string;
    language: string;
    tags?: string[] | string;
    userId: string;
  }): Promise<Snippet> => {
    console.log("[SNIPPET_CREATE] Starting snippet creation:", { 
      title: data.title, 
      language: data.language,
      userId: data.userId,
      codeLength: data.code?.length || 0,
      tags: data.tags
    });
    
    // Create a fresh client for this request
    const client = createSupabaseClient();
    const snippetId = uuidv4();
    const now = new Date().toISOString();
    
    // Process tags properly
    let processedTags: string[] = [];
    if (Array.isArray(data.tags)) {
      processedTags = data.tags;
      console.log("[SNIPPET_CREATE] Using array tags:", processedTags);
    } else if (typeof data.tags === 'string') {
      processedTags = data.tags.split(',').map(t => t.trim()).filter(t => t);
      console.log("[SNIPPET_CREATE] Processed string tags:", processedTags);
    } else {
      processedTags = [];
      console.log("[SNIPPET_CREATE] No tags provided, using empty array");
    }
    
    try {
      console.log("[SNIPPET_CREATE] Inserting into Supabase with ID:", snippetId);
      const { data: newSnippet, error } = await client
        .from('snippets')
        .insert({
          id: snippetId,
          title: data.title,
          code: data.code,
          description: data.description,
          language: data.language || 'text',
          tags: processedTags,
          user_id: data.userId,
          created_at: now,
          updated_at: now
        })
        .select()
        .single();
        
      if (error) {
        console.error("[SNIPPET_CREATE] Supabase error:", error);
        throw new Error(`Failed to create snippet: ${error?.message || 'Unknown error'}`);
      }
      
      if (!newSnippet) {
        console.error("[SNIPPET_CREATE] No snippet data returned from Supabase");
        throw new Error('Failed to create snippet: No data returned');
      }
      
      console.log("[SNIPPET_CREATE] Successfully created snippet:", newSnippet.id);
      
      return {
        id: newSnippet.id,
        title: newSnippet.title,
        code: newSnippet.code,
        description: newSnippet.description,
        language: newSnippet.language,
        tags: newSnippet.tags,
        userId: newSnippet.user_id,
        createdAt: newSnippet.created_at,
        updatedAt: newSnippet.updated_at
      };
    } catch (error) {
      console.error("[SNIPPET_CREATE] Exception during creation:", error);
      // Rethrow with clear error message
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Failed to create snippet: ${JSON.stringify(error)}`);
      }
    }
  },
  
  update: async (where: { id: string }, data: Partial<Omit<Snippet, 'id' | 'createdAt' | 'userId'>>): Promise<Snippet | null> => {
    // Create a fresh client for this request
    const client = createSupabaseClient();
    const now = new Date().toISOString();
    
    console.log("[DB_UPDATE] Starting update for snippet:", where.id);
    console.log("[DB_UPDATE] Update data:", data);
    
    // Process tags if they're provided as a string
    const processedData: any = { ...data, updated_at: now };
    
    // Remove the camelCase version of updatedAt since Supabase uses snake_case
    if ('updatedAt' in processedData) {
      delete processedData.updatedAt;
      console.log("[DB_UPDATE] Removed 'updatedAt' property (using 'updated_at' instead)");
    }
    
    if (data.tags && typeof data.tags === 'string') {
      processedData.tags = data.tags.split(',').map(t => t.trim());
      console.log("[DB_UPDATE] Processed tags from string:", processedData.tags);
    }
    
    // Map property names to snake_case for Supabase
    if ('userId' in processedData) {
      processedData.user_id = processedData.userId;
      delete processedData.userId;
      console.log("[DB_UPDATE] Mapped userId to user_id:", processedData.user_id);
    }
    
    // Ensure we're not sending undefined values to Supabase
    Object.keys(processedData).forEach(key => {
      if (processedData[key] === undefined) {
        console.log(`[DB_UPDATE] Removing undefined value for ${key}`);
        delete processedData[key];
      }
    });
    
    console.log("[DB_UPDATE] Final data being sent to Supabase:", processedData);
    
    try {
      const { data: updatedSnippet, error } = await client
        .from('snippets')
        .update(processedData)
        .eq('id', where.id)
        .select()
        .single();
        
      if (error) {
        console.error("[DB_UPDATE] Supabase error:", error);
        return null;
      }
      
      if (!updatedSnippet) {
        console.error("[DB_UPDATE] No updated snippet returned from Supabase");
        return null;
      }
      
      console.log("[DB_UPDATE] Successfully updated snippet:", updatedSnippet);
      
      return {
        id: updatedSnippet.id,
        title: updatedSnippet.title,
        code: updatedSnippet.code,
        description: updatedSnippet.description,
        language: updatedSnippet.language,
        tags: updatedSnippet.tags,
        userId: updatedSnippet.user_id,
        createdAt: updatedSnippet.created_at,
        updatedAt: updatedSnippet.updated_at
      };
    } catch (error) {
      console.error("[DB_UPDATE] Exception during update:", error);
      return null;
    }
  },
  
  delete: async (where: { id: string }): Promise<Snippet | null> => {
    // Create a fresh client for this request
    const client = createSupabaseClient();
    
    // First get the snippet to return it
    const { data: snippet } = await client
      .from('snippets')
      .select('*')
      .eq('id', where.id)
      .single();
      
    if (!snippet) {
      return null;
    }
    
    const { error } = await client
      .from('snippets')
      .delete()
      .eq('id', where.id);
      
    if (error) {
      return null;
    }
    
    return {
      id: snippet.id,
      title: snippet.title,
      code: snippet.code,
      description: snippet.description,
      language: snippet.language,
      tags: snippet.tags,
      userId: snippet.user_id,
      createdAt: snippet.created_at,
      updatedAt: snippet.updated_at
    };
  }
}; 
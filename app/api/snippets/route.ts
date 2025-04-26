import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, getUserFromSession } from "@/lib/supabase-helper";
import { snippetDb } from "@/lib/db";

// GET - Get all snippets or user-specific snippets
export async function GET(request: NextRequest) {
  try {
    console.log("[SNIPPETS_API_GET] Request received");
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    // If userId is provided, get snippets for that user
    if (userId) {
      console.log("[SNIPPETS_API_GET] Fetching snippets for userId:", userId);
      const snippets = await snippetDb.findMany({ userId });
      console.log("[SNIPPETS_API_GET] Found snippets:", snippets?.length || 0);
      // Ensure we always return an array
      return NextResponse.json(Array.isArray(snippets) ? snippets : []);
    }

    // Get user from session
    const user = await getUserFromSession();
    console.log("[SNIPPETS_API_GET] Session user:", user?.id);
    
    if (user?.id) {
      console.log("[SNIPPETS_API_GET] Fetching snippets for session user");
      const snippets = await snippetDb.findMany({ userId: user.id });
      console.log("[SNIPPETS_API_GET] Found snippets:", snippets?.length || 0);
      return NextResponse.json(Array.isArray(snippets) ? snippets : []);
    }
    
    // Otherwise get all snippets
    console.log("[SNIPPETS_API_GET] Fetching all snippets (no user filter)");
    const snippets = await snippetDb.findMany();
    console.log("[SNIPPETS_API_GET] Found snippets:", snippets?.length || 0);
    // Ensure we always return an array
    return NextResponse.json(Array.isArray(snippets) ? snippets : []);
  } catch (error) {
    console.error("[SNIPPETS_API_GET_ERROR]", error);
    // Return empty array on error instead of error object
    return NextResponse.json([], { status: 500 });
  }
}

// POST - Create a new snippet
export async function POST(request: NextRequest) {
  try {
    console.log("[SNIPPETS_API_POST] Request received");
    
    // Get user from Supabase session
    const user = await getUserFromSession();
    console.log("[SNIPPETS_API_POST] User from session:", user?.id);
    
    if (!user?.id) {
      console.error("[SNIPPETS_API_POST] No user in session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("[SNIPPETS_API_POST] Request body:", {
      title: body.title,
      language: body.language,
      userId: body.userId,
      codeLength: body.code?.length || 0
    });
    
    const { title, code, description, language, tags, userId } = body;

    // Verify that userId in request matches session user
    if (userId && userId !== user.id) {
      console.error("[SNIPPETS_API_POST] User ID mismatch:", { sessionId: user.id, requestId: userId });
      return NextResponse.json({ error: "User ID mismatch" }, { status: 403 });
    }

    if (!title || !code) {
      console.error("[SNIPPETS_API_POST] Missing required fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create a supabase client
    const supabase = createServerSupabaseClient();
    
    try {
      // DIRECT APPROACH: Create the snippet with a SQL RPC function that handles the foreign key
      console.log("[SNIPPETS_API_POST] Creating snippet using direct SQL function");
      
      // Process tags properly
      let processedTags;
      if (Array.isArray(tags)) {
        processedTags = tags;
      } else if (typeof tags === 'string') {
        processedTags = tags.split(',').map(t => t.trim()).filter(t => t);
      } else {
        processedTags = [];
      }
      
      // Generate a UUID for the snippet
      const snippetId = crypto.randomUUID();
      const now = new Date().toISOString();
      
      // Use a direct SQL query to insert the snippet with a bypass for the foreign key constraint
      const { data: directSnippet, error: directError } = await supabase
        .rpc('create_snippet_with_user', {
          p_snippet_id: snippetId,
          p_title: title,
          p_code: code,
          p_description: description || '',
          p_language: language || 'text',
          p_tags: processedTags,
          p_user_id: user.id,
          p_created_at: now,
          p_updated_at: now
        });
        
      if (directError) {
        console.error("[SNIPPETS_API_POST] Direct SQL error:", directError);
        // Continue to try the normal approach
      } else {
        console.log("[SNIPPETS_API_POST] Snippet created successfully via SQL function:", snippetId);
        return NextResponse.json({
          id: snippetId,
          title,
          code,
          description,
          language: language || 'text',
          tags: processedTags,
          userId: user.id,
          createdAt: now,
          updatedAt: now
        });
      }
    } catch (sqlError) {
      console.error("[SNIPPETS_API_POST] Error in SQL approach:", sqlError);
      // Continue to try the normal approach
    }

    // FALLBACK: Try creating the snippet normally
    console.log("[SNIPPETS_API_POST] Creating snippet using snippetDb.create()");
    const snippet = await snippetDb.create({
      title,
      code,
      description,
      language: language || "text",
      tags,
      userId: user.id,
    });
    
    console.log("[SNIPPETS_API_POST] Snippet created successfully:", snippet.id);
    return NextResponse.json(snippet);
  } catch (error) {
    console.error("[SNIPPETS_API_POST_ERROR]", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: String(error),
      message: "Unable to create snippet. Please try again later."
    }, { status: 500 });
  }
} 
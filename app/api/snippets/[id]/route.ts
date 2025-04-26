import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, getUserFromSession } from "@/lib/supabase-helper";
import { snippetDb } from "@/lib/db";

// GET - Get a specific snippet
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const snippet = await snippetDb.findUnique({ id });

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    return NextResponse.json(snippet);
  } catch (error) {
    console.error("[SNIPPET_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update a snippet (full update)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log(`[SNIPPET_PUT] Processing update for snippet id: ${id}`);
    
    // Get user from Supabase session
    const user = await getUserFromSession();
    console.log(`[SNIPPET_PUT] User from session:`, user?.id);
    
    if (!user?.id) {
      console.log(`[SNIPPET_PUT] Unauthorized: No valid session`);
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const snippet = await snippetDb.findUnique({ id });

    if (!snippet) {
      console.log(`[SNIPPET_PUT] Snippet not found with id: ${id}`);
      return NextResponse.json({ message: "Snippet not found" }, { status: 404 });
    }

    if (snippet.userId !== user.id) {
      console.log(`[SNIPPET_PUT] Forbidden: User ${user.id} trying to update snippet owned by ${snippet.userId}`);
      return NextResponse.json({ message: "You can only update your own snippets" }, { status: 403 });
    }

    let body;
    try {
      body = await request.json();
      console.log(`[SNIPPET_PUT] Request body parsed:`, {
        title: body.title,
        language: body.language,
        tagsType: typeof body.tags,
        tagsLength: Array.isArray(body.tags) ? body.tags.length : 0
      });
    } catch (error) {
      console.error("[SNIPPET_PUT] Failed to parse request body:", error);
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    // Extract fields with default values
    const { 
      title = snippet.title, 
      code = snippet.code, 
      description = snippet.description, 
      language = snippet.language, 
      tags = snippet.tags 
    } = body;

    // Validate required fields
    if (!code) {
      console.log(`[SNIPPET_PUT] Validation failed: Missing code`);
      return NextResponse.json({ message: "Code is required" }, { status: 400 });
    }

    if (!language) {
      console.log(`[SNIPPET_PUT] Validation failed: Missing language`);
      return NextResponse.json({ message: "Language is required" }, { status: 400 });
    }

    try {
      console.log(`[SNIPPET_PUT] Calling snippetDb.update with:`, {
        id,
        title,
        codeLength: code?.length || 0,
        description: description?.slice(0, 50),
        language,
        tags
      });
      
      const updatedSnippet = await snippetDb.update(
        { id },
        {
          title,
          code,
          description,
          language,
          tags
        }
      );
      
      if (!updatedSnippet) {
        console.error(`[SNIPPET_PUT] Update returned null for snippet id: ${id}`);
        return NextResponse.json({ message: "Failed to update snippet in database" }, { status: 500 });
      }
      
      console.log(`[SNIPPET_PUT] Successfully updated snippet id: ${id}`, {
        id: updatedSnippet.id,
        title: updatedSnippet.title,
        language: updatedSnippet.language,
        tags: updatedSnippet.tags,
      });
      
      return NextResponse.json(updatedSnippet);
    } catch (dbError) {
      console.error("[SNIPPET_PUT_DB_ERROR]", dbError);
      return NextResponse.json({ 
        message: "Failed to update snippet in database",
        details: String(dbError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error("[SNIPPET_PUT_ERROR]", error);
    return NextResponse.json({ 
      message: "Failed to update snippet",
      details: String(error)
    }, { status: 500 });
  }
}

// PATCH - Update a snippet (partial update)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log(`[SNIPPET_PATCH] Processing update for snippet id: ${id}`);
    
    // Get user from Supabase session
    const user = await getUserFromSession();
    console.log(`[SNIPPET_PATCH] User from session:`, user?.id);
    
    if (!user?.id) {
      console.log(`[SNIPPET_PATCH] Unauthorized: No valid session`);
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const snippet = await snippetDb.findUnique({ id });

    if (!snippet) {
      console.log(`[SNIPPET_PATCH] Snippet not found with id: ${id}`);
      return NextResponse.json({ message: "Snippet not found" }, { status: 404 });
    }

    if (snippet.userId !== user.id) {
      console.log(`[SNIPPET_PATCH] Forbidden: User ${user.id} trying to update snippet owned by ${snippet.userId}`);
      return NextResponse.json({ message: "You can only update your own snippets" }, { status: 403 });
    }

    let body;
    try {
      body = await request.json();
      console.log(`[SNIPPET_PATCH] Request body parsed:`, body);
    } catch (error) {
      console.error("[SNIPPET_PATCH] Failed to parse request body:", error);
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const { title, code, description, language, tags } = body;

    if (!title && !code && !description && !language && !tags) {
      console.log(`[SNIPPET_PATCH] No fields to update provided`);
      return NextResponse.json({ message: "No fields to update" }, { status: 400 });
    }

    try {
      const updatedSnippet = await snippetDb.update(
        { id },
        {
          title,
          code,
          description,
          language,
          tags,
          updatedAt: new Date().toISOString(),
        }
      );
      
      if (!updatedSnippet) {
        console.error(`[SNIPPET_PATCH] Update returned null for snippet id: ${id}`);
        return NextResponse.json({ message: "Failed to update snippet in database" }, { status: 500 });
      }
      
      console.log(`[SNIPPET_PATCH] Successfully updated snippet id: ${id}`);
      return NextResponse.json(updatedSnippet);
    } catch (dbError) {
      console.error("[SNIPPET_PATCH_DB_ERROR]", dbError);
      return NextResponse.json({ 
        message: "Failed to update snippet in database",
        details: String(dbError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error("[SNIPPET_PATCH_ERROR]", error);
    return NextResponse.json({ message: "Failed to update snippet" }, { status: 500 });
  }
}

// DELETE - Delete a snippet
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log(`[SNIPPET_DELETE] Processing delete for snippet id: ${id}`);
    
    // Get user from Supabase session
    const user = await getUserFromSession();
    console.log(`[SNIPPET_DELETE] User from session:`, user?.id);
    
    if (!user?.id) {
      console.log(`[SNIPPET_DELETE] Unauthorized: No valid session`);
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const snippet = await snippetDb.findUnique({ id });

    if (!snippet) {
      console.log(`[SNIPPET_DELETE] Snippet not found with id: ${id}`);
      return NextResponse.json({ message: "Snippet not found" }, { status: 404 });
    }

    if (snippet.userId !== user.id) {
      console.log(`[SNIPPET_DELETE] Forbidden: User ${user.id} trying to delete snippet owned by ${snippet.userId}`);
      return NextResponse.json({ message: "You can only delete your own snippets" }, { status: 403 });
    }

    try {
      const deletedSnippet = await snippetDb.delete({ id });
      console.log(`[SNIPPET_DELETE] Successfully deleted snippet id: ${id}`);
      return NextResponse.json(deletedSnippet);
    } catch (dbError) {
      console.error("[SNIPPET_DELETE_DB_ERROR]", dbError);
      return NextResponse.json({ 
        message: "Failed to delete snippet from database",
        details: String(dbError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error("[SNIPPET_DELETE_ERROR]", error);
    return NextResponse.json({ message: "Failed to delete snippet" }, { status: 500 });
  }
} 
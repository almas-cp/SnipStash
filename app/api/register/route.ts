import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logger, formatError } from "@/lib/utils";

// These directives ensure proper execution in serverless environments
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  logger.info("[REGISTER] Starting registration process");
  
  // Check if environment variables are properly set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    logger.error("[REGISTER] Missing Supabase environment variables", {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "set" : "missing",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "set" : "missing"
    });
    
    return NextResponse.json({
      error: "Server configuration error",
      message: "The server is not properly configured. Please contact the administrator.",
      details: "Missing Supabase credentials"
    }, { status: 500 });
  }
  
  try {
    const body = await request.json();
    const { email, name, password } = body;
    
    logger.info(`[REGISTER] Received registration for: ${email}`);

    if (!email || !password) {
      logger.warn("[REGISTER] Missing required fields");
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    // Create a fresh Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // Create user in Supabase auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
        },
      },
    });
    
    if (error) {
      logger.error("[REGISTER] Supabase auth error", error);
      return NextResponse.json({ 
        error: error.message,
        details: error.cause || error.name
      }, { status: 400 });
    }

    if (data?.user) {
      logger.info(`[REGISTER] User created successfully: ${data.user.id}`);
      
      // Check if email confirmation is required
      if (!data.session) {
        return NextResponse.json({ 
          message: "Registration successful. Please check your email to confirm your account.",
          user: { 
            id: data.user.id, 
            email: data.user.email 
          } 
        });
      }
      
      return NextResponse.json({ 
        message: "Registration successful",
        user: { 
          id: data.user.id, 
          email: data.user.email
        } 
      });
    } else {
      logger.error("[REGISTER] User data not returned from Supabase");
      return NextResponse.json({ 
        error: "Failed to create user", 
      }, { status: 500 });
    }
  } catch (error) {
    logger.error("[REGISTER] Request processing error", error);
    return NextResponse.json({ 
      error: "Internal error", 
      ...formatError(error)
    }, { status: 500 });
  }
} 
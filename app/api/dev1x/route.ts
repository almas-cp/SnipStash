import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Define paths to data files
    const usersPath = path.join(process.cwd(), 'data', 'users.json');
    const snippetsPath = path.join(process.cwd(), 'data', 'snippets.json');
    
    // Read file contents
    const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    const snippetsData = JSON.parse(fs.readFileSync(snippetsPath, 'utf8'));
    
    // Return the data
    return NextResponse.json({
      users: usersData,
      snippets: snippetsData,
      meta: {
        userCount: usersData.length,
        snippetCount: snippetsData.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("[DEV1X_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to read data files" },
      { status: 500 }
    );
  }
} 
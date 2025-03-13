import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-auth-user";

/**
 * Test endpoint for authentication
 * This endpoint is used to verify that authentication is working correctly
 * It returns the authenticated user ID if authentication is successful
 */
export async function GET(request: NextRequest) {
  try {
    // Get user ID from request
    const userId = await getAuthUser(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        userId,
        message: "Authentication successful",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: unknown) {
    console.error("Error in auth test endpoint:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Authentication test failed" },
      { status: 500 }
    );
  }
}

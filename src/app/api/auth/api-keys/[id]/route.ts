import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services/supabase/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get current session to verify user
    const sessionResult = await authService.getSession();
    
    if (!sessionResult.success || !sessionResult.session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const keyId = params.id;
    
    // Delete API key
    const success = await authService.deleteApiKey(keyId);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to delete API key" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "API key deleted successfully"
    });
  } catch (error: unknown) {
    console.error("API key deletion error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete API key" },
      { status: 500 }
    );
  }
}

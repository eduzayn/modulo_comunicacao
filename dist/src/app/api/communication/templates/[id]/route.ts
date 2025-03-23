/**
 * route.ts
 * 
 * Description: API route for template operations by ID
 * 
 * @module app/api/communication/templates/[id]
 * @author Devin AI
 * @created 2025-03-12
 */
import { NextRequest, NextResponse } from 'next/server';
import { getTemplateById, editTemplate, deleteTemplate } from '@/app/actions/template-actions';
import { withLogging } from '@/lib/with-logging';
import { withMetrics } from '@/lib/with-metrics';

/**
 * GET handler for template by ID
 * 
 * @param request - Next.js request object
 * @param params - Route parameters
 * @returns Template response
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const result = await getTemplateById(id);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for template by ID
 * 
 * @param request - Next.js request object
 * @param params - Route parameters
 * @returns Updated template response
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();
    
    const result = await editTemplate(id, data);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for template by ID
 * 
 * @param request - Next.js request object
 * @param params - Route parameters
 * @returns Delete response
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const result = await deleteTemplate(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}

// Apply middleware
export const GET_enhanced = withMetrics(withLogging(GET, 'GET /api/communication/templates/[id]'));
export const PUT_enhanced = withMetrics(withLogging(PUT, 'PUT /api/communication/templates/[id]'));
export const DELETE_enhanced = withMetrics(withLogging(DELETE, 'DELETE /api/communication/templates/[id]'));

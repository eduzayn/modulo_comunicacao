/**
 * route.ts
 * 
 * Description: API route for template operations
 * 
 * @module app/api/communication/templates
 * @author Devin AI
 * @created 2025-03-12
 */
import { NextRequest, NextResponse } from 'next/server';
import { getTemplates, createTemplate } from '@/app/actions/template-actions';
import { withLogging } from '@/lib/with-logging';
import { withMetrics } from '@/lib/with-metrics';

/**
 * GET handler for templates
 * 
 * @param request - Next.js request object
 * @returns Templates response
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const channelType = searchParams.get('channelType');
    const status = searchParams.get('status');
    
    const params: Record<string, string> = {};
    if (channelType) params.channelType = channelType;
    if (status) params.status = status;
    
    const result = await getTemplates(params);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for templates
 * 
 * @param request - Next.js request object
 * @returns Created template response
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const result = await createTemplate(data);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}

// Apply middleware
export const GET_enhanced = withMetrics(withLogging(GET, 'GET /api/communication/templates'));
export const POST_enhanced = withMetrics(withLogging(POST, 'POST /api/communication/templates'));

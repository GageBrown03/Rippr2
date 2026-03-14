import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { successResponse, errorResponse } from '@/utils/response';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getSessionUser(request);

    if (!user) {
      return errorResponse('Not authenticated', 401);
    }

    return successResponse(user);
  } catch {
    return errorResponse('Internal server error', 500);
  }
}

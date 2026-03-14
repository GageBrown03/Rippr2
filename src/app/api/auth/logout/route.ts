import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/utils/response';
import logger from '@/lib/logger';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const token = request.cookies.get('session_token')?.value;

    if (token) {
      await deleteSession(token);
    }

    const response = successResponse({ message: 'Logged out' });
    response.cookies.set('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error) {
    logger.error('Logout error', { error });
    return errorResponse('Internal server error', 500);
  }
}

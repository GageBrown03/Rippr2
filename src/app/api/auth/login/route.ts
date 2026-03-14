import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, createSession } from '@/lib/auth';
import { loginSchema } from '@/utils/validation';
import { successResponse, errorResponse } from '@/utils/response';
import logger from '@/lib/logger';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    const valid = await verifyPassword(password, user.passwordHash);

    if (!valid) {
      return errorResponse('Invalid email or password', 401);
    }

    const session = await createSession(user.id);

    logger.info(`User logged in: ${user.username}`);

    const response = successResponse({
      id: user.id,
      email: user.email,
      username: user.username,
      coins: user.coins,
    });

    response.cookies.set('session_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: session.expiresAt,
      path: '/',
    });

    return response;
  } catch (error) {
    logger.error('Login error', { error });
    return errorResponse('Internal server error', 500);
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createSession } from '@/lib/auth';
import { registerSchema } from '@/utils/validation';
import { successResponse, errorResponse } from '@/utils/response';
import logger from '@/lib/logger';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { email, username, password } = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return errorResponse(`${field} already taken`, 409);
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
      },
    });

    const session = await createSession(user.id);

    logger.info(`User registered: ${user.username}`);

    const response = successResponse({
      id: user.id,
      email: user.email,
      username: user.username,
      coins: user.coins,
    }, 201);

    response.cookies.set('session_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: session.expiresAt,
      path: '/',
    });

    return response;
  } catch (error) {
    logger.error('Registration error', { error });
    return errorResponse('Internal server error', 500);
  }
}

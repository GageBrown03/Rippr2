import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/types';

export function successResponse<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status: number = 400): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ success: false, error: message }, { status });
}

import { hashPassword, verifyPassword } from '@/lib/auth';

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    session: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

describe('Auth utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const hash = await hashPassword('testpassword123');
      expect(hash).toBeDefined();
      expect(hash).not.toBe('testpassword123');
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should produce different hashes for same password', async () => {
      const hash1 = await hashPassword('testpassword123');
      const hash2 = await hashPassword('testpassword123');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify a correct password', async () => {
      const hash = await hashPassword('testpassword123');
      const result = await verifyPassword('testpassword123', hash);
      expect(result).toBe(true);
    });

    it('should reject an incorrect password', async () => {
      const hash = await hashPassword('testpassword123');
      const result = await verifyPassword('wrongpassword', hash);
      expect(result).toBe(false);
    });
  });

  describe('createSession', () => {
    it('should create a session with token and expiry', async () => {
      const prisma = require('@/lib/prisma').default;
      const { createSession } = require('@/lib/auth');
      
      const mockSession = {
        id: 'session-id',
        userId: 'user-id',
        token: 'mock-token',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      };
      
      prisma.session.create.mockResolvedValue(mockSession);
      
      const result = await createSession('user-id');
      
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('expiresAt');
      expect(result.token).toBeDefined();
      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(prisma.session.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-id',
            token: expect.any(String),
            expiresAt: expect.any(Date),
          }),
        })
      );
    });
  });

  describe('getSessionUser', () => {
    it('should return null for missing session token', async () => {
      const { getSessionUser } = require('@/lib/auth');
      
      const mockRequest = {
        cookies: {
          get: jest.fn().mockReturnValue(undefined),
        },
      };
      
      const result = await getSessionUser(mockRequest as any);
      expect(result).toBeNull();
    });
  });
});

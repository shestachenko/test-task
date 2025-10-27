import {AuthGuard} from './auth.guard';
import {UnauthorizedException} from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    guard = new AuthGuard();
  });

  it('should return true when user is authenticated', () => {
    const mockRequest = {
      session: {
        userId: 'user123',
      },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as any;

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw UnauthorizedException when no session exists', () => {
    const mockRequest = null;

    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as any;

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow('Authentication required');
  });

  it('should throw UnauthorizedException when session exists but no userId', () => {
    const mockRequest = {
      session: {},
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as any;

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow('Authentication required');
  });

  it('should throw UnauthorizedException when session is null', () => {
    const mockRequest = {
      session: null,
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as any;

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});

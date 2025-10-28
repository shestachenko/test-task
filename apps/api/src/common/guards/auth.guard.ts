import {Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException} from '@nestjs/common';
import '../types/session.types';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // Check if request and session exist
    if (!request?.session?.userId) {
      throw new UnauthorizedException('Authentication required');
    }
    
    // Attach user info to request for easy access
    request.user = {
      userId: request.session.userId,
      username: request.session.username,
      email: request.session.email,
    };
    
    return true;
  }
  
  /**
   * Check if the request is from the authenticated user
   */
  static checkUserId(request: any, targetUserId: string): void {
    if (!request?.session?.userId) {
      throw new UnauthorizedException('Authentication required');
    }
    
    if (request.session.userId !== targetUserId) {
      throw new ForbiddenException('Access denied: You can only access your own data');
    }
  }
}

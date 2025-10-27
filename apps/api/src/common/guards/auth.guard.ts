import {Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import '../types/session.types';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // Check if request and session exist
    if (!request?.session?.userId) {
      throw new UnauthorizedException('Authentication required');
    }
    
    return true;
  }
}

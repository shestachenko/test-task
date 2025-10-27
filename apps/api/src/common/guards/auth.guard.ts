import {Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    if (!request.session || !request.session.userId) {
      throw new UnauthorizedException('Authentication required');
    }
    
    return true;
  }
}

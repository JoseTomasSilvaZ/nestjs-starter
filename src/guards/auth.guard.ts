import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.getAuthorizationToken(request);
    if (token === null) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const payload = this.jwt.verify(token);
      request.user = payload;
      return true;
    } catch (error) {
      throw new ForbiddenException(error?.message ?? 'Expired token');
    }
  }

  private getAuthorizationToken(request: Request) {
    const header = request.headers['authorization'];
    if (!header) {
      return null;
    }
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) {
      return null;
    }
    return token;
  }
}

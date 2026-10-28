import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { IS_PUBLIC_KEY } from '../decorators/auth.decorator';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Super Admin has global platform scope
    if (user && user.role === Role.SUPER_ADMIN) {
      return true;
    }

    if (user && user.tenantId) {
      const headerTenant = request.headers['x-tenant-id'];
      if (headerTenant && headerTenant !== user.tenantId) {
        throw new ForbiddenException('Cross-tenant action forbidden');
      }
      return true;
    }

    return true;
  }
}

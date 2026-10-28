import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContext } from './tenant.context';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user;
    const headerTenant = req.headers['x-tenant-id'] as string;
    const tenantId = user?.tenantId || headerTenant || undefined;
    const userId = user?.id || undefined;
    const role = user?.role || undefined;

    TenantContext.run({ tenantId, userId, role }, () => {
      next();
    });
  }
}

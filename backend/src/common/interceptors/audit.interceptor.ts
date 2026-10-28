import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req?.user;
    const method = req?.method;
    const url = req?.url;

    // We log non-GET state changes or sensitive queries
    return next.handle().pipe(
      tap(async () => {
        if (user && (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE')) {
          try {
            await this.prisma.auditLog.create({
              data: {
                tenantId: user.tenantId || null,
                actorId: user.id,
                action: `${method}_${url}`,
                resource: url,
                ipAddress: req.ip || req.connection?.remoteAddress,
                userAgent: req.headers['user-agent'],
              },
            });
          } catch (e) {
            // Audit logging should not crash the main flow
          }
        }
      }),
    );
  }
}

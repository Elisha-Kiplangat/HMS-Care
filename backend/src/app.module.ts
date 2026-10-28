import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import configuration from './config/configuration';
import { validateEnv } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { TenantMiddleware } from './common/tenancy/tenant.middleware';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { InvitationsModule } from './modules/invitations/invitations.module';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { CliniciansModule } from './modules/clinicians/clinicians.module';
import { GlucoseModule } from './modules/glucose/glucose.module';
import { Hba1cModule } from './modules/hba1c/hba1c.module';
import { MedicationsModule } from './modules/medications/medications.module';
import { RefillsModule } from './modules/refills/refills.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { TelemedicineModule } from './modules/telemedicine/telemedicine.module';
import { TriageModule } from './modules/triage/triage.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ExportsModule } from './modules/exports/exports.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuditModule } from './modules/audit/audit.module';
import { ConsentsModule } from './modules/consents/consents.module';
import { HealthModule } from './modules/health/health.module';

import { RealtimeModule } from './realtime/realtime.module';
import { QueuesModule } from './queues/queues.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
    }),
    PrismaModule,
    AuthModule,
    TenantsModule,
    InvitationsModule,
    UsersModule,
    PatientsModule,
    CliniciansModule,
    GlucoseModule,
    Hba1cModule,
    MedicationsModule,
    RefillsModule,
    AppointmentsModule,
    TelemedicineModule,
    TriageModule,
    AnalyticsModule,
    ExportsModule,
    NotificationsModule,
    AuditModule,
    ConsentsModule,
    HealthModule,
    RealtimeModule,
    QueuesModule.register(),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: TenantGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}

import { PrismaClient } from '@prisma/client';

export function createTenantPrismaClient(prisma: PrismaClient, tenantId: string) {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, args, query }: { operation: string; args: any; query: (args: any) => Promise<any> }) {
          if (
            ['findMany', 'findFirst', 'findUnique', 'count', 'aggregate', 'groupBy'].includes(
              operation
            )
          ) {
            args.where = { ...args.where, tenantId };
          }
          if (['create', 'createMany', 'update', 'updateMany', 'upsert'].includes(operation)) {
            if (args.data && typeof args.data === 'object') {
              args.data = { ...args.data, tenantId };
            }
          }
          return query(args);
        },
      },
    },
  });
}

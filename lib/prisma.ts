import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ['query'], // opcional, remove em produção se quiser
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

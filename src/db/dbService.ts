import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export { Url } from '@prisma/client';
export const DBUrl = prisma.url;
export const DBStats = prisma.stats;

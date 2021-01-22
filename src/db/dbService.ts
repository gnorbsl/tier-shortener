import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

// @ts-ignore
export { Url, UrlCreateInput } from '@prisma/client';
export const DBUrl = prisma.url;
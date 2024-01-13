import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// needed so vercel adds prisma dir to serveless api lambdas
const files = fs.readdirSync(path.join(process.cwd(), 'prisma'));

// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices#problem
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

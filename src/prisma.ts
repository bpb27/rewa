import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// needed so vercel adds prisma dir to serveless api lambdas
const files = fs.readdirSync(path.join(process.cwd(), 'prisma'));

export class Prisma {
  public static Prisma: PrismaClient;

  static getPrisma() {
    this.Prisma ||= new PrismaClient({ log: ['query'] }); // { log: ['query'] }
    return this.Prisma;
  }
}

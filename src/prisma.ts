import { PrismaClient } from '@prisma/client';

export class Prisma {
  public static Prisma: PrismaClient;

  static getPrisma() {
    this.Prisma ||= new PrismaClient({ log: ['query'] }); // { log: ['query'] }
    return this.Prisma;
  }
}

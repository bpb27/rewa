import { PrismaClient } from '@prisma/client';

export class Prisma {
  public static Prisma: PrismaClient;

  static getPrisma() {
    // create a new instance of PrismaClient if one isn't already created
    this.Prisma ||= new PrismaClient();
    return this.Prisma;
  }
}

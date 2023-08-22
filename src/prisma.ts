import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

// needed so vercel adds prisma dir to serveless api lambdas
const files = fs.readdirSync(path.join(process.cwd(), "prisma"));

export class Prisma {
  public static Prisma: PrismaClient;

  static getPrisma() {
    this.Prisma = this.Prisma || new PrismaClient();
    return this.Prisma;
  }
}

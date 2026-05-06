import { prisma } from "../lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export class UserRepository {
  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByVerificationToken(token: string) {
    return prisma.user.findFirst({ where: { verificationToken: token } });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  }
}
import { prisma } from "../lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export class NoteRepository {
  async create(data: Prisma.NoteUncheckedCreateInput) {
    return prisma.note.create({ data });
  }

  async findAllByUserId(userId: string) {
    return prisma.note.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  }

  async findByIdAndUserId(id: string, userId: string) {
    return prisma.note.findFirst({ where: { id, userId } });
  }

  async update(id: string, userId: string, data: Prisma.NoteUpdateInput) {
    return prisma.note.update({
      where: { id, userId },
      data,
    });
  }

  async delete(id: string, userId: string) {
    return prisma.note.delete({
      where: { id, userId },
    });
  }
}

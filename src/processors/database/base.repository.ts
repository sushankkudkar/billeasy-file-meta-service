/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Base Repository for generic CRUD operations.
 * @file Provides basic CRUD functionalities using Prisma with PostgreSQL.
 * @module repository/base
 */

import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BaseRepository {
  constructor(@Inject('DATABASE_PROVIDER') private readonly prisma: PrismaClient) {}

  async create(modelName: string, data: unknown) {
    return this.prisma[modelName].create({ data });
  }

  async createMany(modelName: string, data: any) {
    return this.prisma[modelName].createMany({
      data,
    });
  }

  async findOne(modelName: string, where: unknown, select?: unknown, include?: unknown) {
    return this.prisma[modelName].findUnique({ where, select, include });
  }

  async findMany(modelName: string, where: unknown, select?: unknown, include?: unknown) {
    return this.prisma[modelName].findMany({ where, select, include });
  }

  // Updated method name from findAll to findMany
  async findAll(modelName: string, select?: unknown) {
    return this.prisma[modelName].findMany({ select });
  }

  async update(modelName: string, where: unknown, data: unknown) {
    return this.prisma[modelName].update({ where, data });
  }

  async updateMany(modelName: string, where: unknown, data: unknown) {
    return this.prisma[modelName].updateMany({ where, data });
  }

  async delete(modelName: string, where: unknown) {
    return this.prisma[modelName].delete({ where });
  }

  async deleteMany(modelName: string, where: unknown) {
    return this.prisma[modelName].deleteMany({ where });
  }

  async transaction(actions: any[]) {
    return this.prisma.$transaction(actions);
  }
}

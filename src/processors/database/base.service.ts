/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';

/**
 * Generic Service for handling CRUD operations.
 * @template T - The type of the model.
 */
@Injectable()
export class BaseService<T> {
  constructor(
    private readonly baseRepository: BaseRepository,
    private readonly modelName: string,
  ) {}

  async create(data: Partial<T>) {
    return this.baseRepository.create(this.modelName, data);
  }

  async createMany(data: Partial<T[]>) {
    return this.baseRepository.createMany(this.modelName, data);
  }

  async findOne(where: Record<string, any>, select?: Record<string, any>, include?: Record<string, any>) {
    return this.baseRepository.findOne(this.modelName, where, select, include);
  }

  async findMany(where?: Record<string, any>, select?: Record<string, any>, include?: Record<string, any>) {
    return this.baseRepository.findMany(this.modelName, where, select, include);
  }

  async findAll(select?: Record<string, any>) {
    return this.baseRepository.findAll(this.modelName, select);
  }

  async update(where: Record<string, any>, data: Partial<T>) {
    return this.baseRepository.update(this.modelName, where, data);
  }

  async delete(where: Record<string, any>) {
    return this.baseRepository.delete(this.modelName, where);
  }

  async updateMany(where: Record<string, any>, data: Partial<T>) {
    return this.baseRepository.updateMany(this.modelName, where, data);
  }

  async deleteMany(where: Record<string, any>) {
    return this.baseRepository.deleteMany(this.modelName, where);
  }

  async transaction(actions: Array<Promise<any>>) {
    return this.baseRepository.transaction(actions);
  }
}

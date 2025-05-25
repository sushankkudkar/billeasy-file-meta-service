/* eslint-disable @typescript-eslint/no-explicit-any */
// src/factories/model.factory.service.ts
import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';

@Injectable()
export class ModelServiceFactory {
  constructor(private readonly baseRepository: BaseRepository) {}

  createModelService<T>(modelName: string, ServiceClass: new (baseRepo: BaseRepository, modelName: string) => T): T {
    return new ServiceClass(this.baseRepository, modelName);
  }
}

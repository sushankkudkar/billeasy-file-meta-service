import { Injectable } from '@nestjs/common';
import { BaseService } from '~/processors/database/base.service';
import { BaseRepository } from '../base.repository';
import { User, File } from '@prisma/client';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(baseRepository: BaseRepository) {
    super(baseRepository, 'User');
  }
  async findByEmail(email: string) {
    return this.findOne({ email });
  }

  async findById(id: number) {
    return this.findOne({ id });
  }
}

@Injectable()
export class FileService extends BaseService<File> {
  constructor(baseRepository: BaseRepository) {
    super(baseRepository, 'File');
  }
}
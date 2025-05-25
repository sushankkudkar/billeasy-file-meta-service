import { ConflictException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

import { Prisma, User } from '@prisma/client';

import { UserService } from '~/processors/database/services/all.service';

@Injectable()
export class UserModuleService {
  constructor(private readonly userService: UserService) {}

  async findOneByEmail(email: string): Promise<User> {
    return this.userService.findByEmail(email);
  }

  async createUser(data: Prisma.UserCreateInput) {
    const existingUser = await this.userService.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await argon2.hash(data.password);
    return this.userService.create({
      email: data.email,
      password: hashedPassword,
    });
  }
}

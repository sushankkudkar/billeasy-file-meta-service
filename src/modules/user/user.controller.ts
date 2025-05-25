import { Controller, Post, Body } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';

import { UserModuleService } from './user.service';

@Controller('user')
export class UserModuleController {
  constructor(private readonly userMService: UserModuleService) { }

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userMService.createUser(createUserDto);
      return { code: 201, message: 'User created successfully', success: true, data: { user } };
    } catch (error) {
      throw error
    }
  }
}

import { Controller, Post, Body } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';

import { UserModuleService } from './user.service';
import { ResponseMeta } from '~/common/decorators/response.decorator';

@Controller('user')
export class UserModuleController {
  constructor(private readonly userMService: UserModuleService) { }

  @Post('create')
  @ResponseMeta({ code: 201, message: 'User created successfully', success: true })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userMService.createUser(createUserDto);
    return {
      data: { user }
    };
  }
}

import { Module } from '@nestjs/common';
import { UserModuleService } from './user.service';
import { UserService } from '~/processors/database/services/all.service';
import { UserModuleController } from './user.controller';

@Module({
  imports: [],
  controllers: [UserModuleController],
  providers: [UserService, UserModuleService],
  exports: [UserModuleService],
})
export class UserModule {}

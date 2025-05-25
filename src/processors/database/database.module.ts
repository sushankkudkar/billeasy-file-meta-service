import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from '~/processors/app-config/app-config.module';
import { PrismaProvider } from './providers/prisma.provider';
import { BaseRepository } from './base.repository';
import { ModelServiceFactory } from './model.service.factory.util';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [
    {
      provide: 'DATABASE_PROVIDER',
      useClass: PrismaProvider,
    },
    BaseRepository,
    ModelServiceFactory,
  ],
  exports: ['DATABASE_PROVIDER', BaseRepository, ModelServiceFactory],
})
export class DatabaseModule {}

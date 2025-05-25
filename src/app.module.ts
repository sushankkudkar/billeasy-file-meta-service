import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';

import { UserModule } from '~/modules/user/user.module';
import { AuthModule } from '~/modules/auth/auth.module';
import { FileModule } from '~/modules/file/file.module';

import { AllExceptionsFilter } from '~/common/filters/any.exception.filter';
import { JSONTransformerInterceptor } from '~/common/interceptors/json.transformer.interceptor';
import { ResponseInterceptor } from '~/common/interceptors/response.interceptor';

import { AWSModule } from '~/processors/aws/aws.module';
import { DatabaseModule } from '~/processors/database/database.module';
import { LoggerModule } from '~/processors/logger/logger.module';
import { AppConfigModule } from '~/processors/app-config/app-config.module';
import configuration from '~/processors/app-config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    LoggerModule,
    AppConfigModule,
    DatabaseModule,
    AWSModule,
    UserModule,
    AuthModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [{
    provide: APP_INTERCEPTOR,
    useClass: JSONTransformerInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseInterceptor,
  },
  {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
  },],
})
export class AppModule { }

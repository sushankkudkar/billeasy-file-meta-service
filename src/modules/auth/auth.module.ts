import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModuleService } from './auth.service';
import { AuthModuleController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh.strategy';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // Make sure it's imported
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwt.key'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthModuleController],
  providers: [AuthModuleService, JwtStrategy, RefreshTokenStrategy],
})
export class AuthModule {}

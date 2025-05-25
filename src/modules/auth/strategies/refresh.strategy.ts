import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { FastifyRequest } from 'fastify';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyRequest) => {
          return request.cookies?.refreshToken;
        },
      ]),
      secretOrKey: configService.get<string>('app.jwt.key'),
      passReqToCallback: true,
    });
  }

  async validate(payload: any) {
    return { email: payload.email };
  }
}

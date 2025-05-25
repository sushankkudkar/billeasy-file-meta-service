import { FastifyReply } from 'fastify';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserModuleService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthModuleService {
  constructor(
    private userMService: UserModuleService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userMService.findOneByEmail(email);
    if (user && (await argon2.verify(user.password, pass))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any, response: FastifyReply) {
    const payload = { email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Use Fastify's setCookie method
    response.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // true in prod
      sameSite: 'strict',
      path: '/',
    });

    return { accessToken };
  }

  async logout(response: FastifyReply) {
    // Clear cookie with Fastify's clearCookie method
    response.clearCookie('refreshToken', { path: '/' });
    return;
  }
}

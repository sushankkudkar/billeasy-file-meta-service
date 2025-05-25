import { Controller, Post, Body, UseGuards, Request, Res, Get } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { LoginDto } from './dto/login.dto';

import { AuthModuleService } from './auth.service';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard';
import { ResponseMeta } from '~/common/decorators/response.decorator';

@Controller('auth')
export class AuthModuleController {
    constructor(private readonly authMService: AuthModuleService) { }

    @Post('login')
    @ResponseMeta({ code: 200, message: 'User logged in successfully', success: true })
    @ResponseMeta({ code: 401, message: 'Invalid Credentials', success: false })
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: FastifyReply) {
        try {
            const user = await this.authMService.validateUser(loginDto.email, loginDto.password);
            const auth = await this.authMService.login(user, res);
            return {
                data: { auth },
            };
        } catch (error) {
            return {
                success: false,
                code: 401,
                message: error?.message || 'Invalid Credentials',
                error: error?.name || 'Invalid Credentials',
                data: {},
            };
        }
    }

    @UseGuards(JwtRefreshGuard)
    @ResponseMeta({ code: 200, message: 'Token refreshed successfully', success: true })
    @ResponseMeta({ code: 401, message: 'Invalid Credentials', success: false })
    @Get('refresh')
    async refresh(@Request() req, @Res({ passthrough: true }) res: FastifyReply) {
        try {
            const user = req.user;
            const auth = await this.authMService.login(user, res);
            return {
                data: { auth },
            };
        } catch (error) {
            return {
                success: false,
                code: 401,
                message: error?.message || 'Something Went Wrong',
                error: error?.name || 'Something Went Wrong',
                data: {},
            };
        }
    }

    @UseGuards(JwtAuthGuard)
    @ResponseMeta({ code: 200, message: 'User logged out', success: true })
    @Get('logout')
    async logout(@Res({ passthrough: true }) res: FastifyReply) {
        try {
            return await this.authMService.logout(res);
        } catch (error) {
            return {
                success: false,
                code: 500,
                message: error?.message || 'Something Went Wrong',
                error: error?.name || 'Something Went Wrong',
                data: {},
            };
        }
    }
}

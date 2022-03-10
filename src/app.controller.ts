/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  UseGuards,
  Res,
  Get,
  Param,
  Body,
  ValidationPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';
import { Response } from 'express';
import { LoginUserInput } from './auth/dto/login-user.input';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private appService: AppService,
  ) {}

  @Post('auth/login')
  async login(@Body(ValidationPipe) loginInput: LoginUserInput): Promise<any> {
    return this.authService.loginUser(loginInput);
  }

  @Get('auth/verify_email/:token')
  async verifyEmail(@Res() response: Response, @Param('token') token: string) {
    const isVerified = await this.appService.activateEmail(token);

    if (isVerified) {
      response.redirect(process.env.FRONTEND_URL);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload_file')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    return await this.appService.uploadFile(file, res);
  }
}

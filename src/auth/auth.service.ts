/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { LoginUserInput } from './dto/login-user.input';

interface IAuthData {
  user: User;
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const isValidPass = await bcrypt.compare(pass, user.password);
      if (isValidPass) {
        delete user.password;
        return user;
      }
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Invalid credentials',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    throw new HttpException(
      {
        status: HttpStatus.UNAUTHORIZED,
        error: 'Invalid credentials',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }

  async login(user: User): Promise<IAuthData> {
    const payload = { email: user.email, userId: user.id };

    try {
      return {
        user,
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.log('login >>server error', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Ooops! Something broke from our end. Please retry',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async loginUser(loginUserInput: LoginUserInput): Promise<IAuthData> {
    // try {
    const user = await this.validateUser(
      loginUserInput.email,
      loginUserInput.password,
    );
    if (user) {
      return await this.login(user);
    }

    throw new HttpException(
      {
        status: HttpStatus.UNAUTHORIZED,
        error: 'Invalid credentials',
      },
      HttpStatus.UNAUTHORIZED,
    );
    // } catch (error) {
    //   console.log('server error', error);
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.INTERNAL_SERVER_ERROR,
    //       error: 'Ooops! Something broke from our end. Please retry',
    //     },
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }
}

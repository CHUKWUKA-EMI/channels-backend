/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import Email from '../../utils/email';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      createUserInput.userName = `@${createUserInput.userName}`;
      const user = this.userRepository.create(createUserInput);

      await this.userRepository.save(user);

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });
      const url = `${process.env.BACKEND_URL}/auth/verify_email/${token}`;
      const emailClass = new Email();
      const message = emailClass.constructWelcomeEmail(
        user.firstName,
        url,
        'Email Confirmation',
      );
      await emailClass.sendEmail(user.email, 'Email Confirmation', message);
      return user;
    } catch (error) {
      console.log('server error', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Ooops! Something broke from our end. Please retry',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find({
        select: [
          'id',
          'firstName',
          'lastName',
          'userName',
          'email',
          'imageUrl',
          'userRole',
          'isVerified',
          'createdAt',
          'updatedAt',
        ],
      });
    } catch (error) {
      console.log('server error', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Ooops! Something broke from our end. Please retry',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: [
          'id',
          'firstName',
          'lastName',
          'userName',
          'email',
          'imageUrl',
          'userRole',
          'isVerified',
          'createdAt',
          'updatedAt',
        ],
        relations: ['posts'],
      });
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return user;
    } catch (error) {
      console.log('server error', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Ooops! Something broke from our end. Please retry',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'firstName',
        'lastName',
        'userName',
        'email',
        'imageUrl',
        'userRole',
        'isVerified',
        'createdAt',
        'updatedAt',
      ],
      relations: ['posts'],
    });
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async findByUserName(userName: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { userName },
        select: [
          'id',
          'firstName',
          'lastName',
          'userName',
          'email',
          'imageUrl',
          'userRole',
          'isVerified',
          'createdAt',
          'updatedAt',
        ],
        relations: ['posts'],
      });
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
    } catch (error) {
      console.log('server error', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Ooops! Something broke from our end. Please retry',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async activateEmail(token: string): Promise<boolean> {
    try {
      const { id } = <any>jwt.verify(token, process.env.JWT_SECRET);

      if (!id) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Invalid token',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await this.userRepository.findOne(id);
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: "User's details no longer available. Try and register again",
          },
          HttpStatus.NOT_FOUND,
        );
      }
      await this.userRepository.update(user.id, { isVerified: true });
      return true;
    } catch (error) {
      if (error) {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async update(email: string, updateUserInput: UpdateUserInput): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({ email });
      if (user) {
        user.firstName = updateUserInput.firstName ?? user.firstName;
        user.lastName = updateUserInput.lastName ?? user.lastName;
        user.userName = updateUserInput.userName
          ? '@' + updateUserInput.userName
          : user.userName;
        user.email = updateUserInput.email ?? user.email;
        user.imageUrl = updateUserInput.imageUrl;

        return await this.userRepository.save(user);
      }

      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    } catch (error) {
      console.log('server error', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Ooops! Something broke from our end. Please retry',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<string> {
    try {
      await this.userRepository.delete({ id });
      return 'User deleted';
    } catch (error) {
      console.log('server error', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Ooops! Something broke from our end. Please retry',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

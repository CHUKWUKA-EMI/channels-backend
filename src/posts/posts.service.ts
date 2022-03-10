/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createPostInput: CreatePostInput,
    userId: string,
  ): Promise<Post> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      const post = this.postRepository.create({ ...createPostInput, user });
      return await this.postRepository.save(post);
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

  async findAll(): Promise<Post[]> {
    try {
      const posts = await this.postRepository.find({
        order: { createdAt: 'DESC' },
        relations: ['user'],
      });
      return posts;
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

  async findOne(id: string): Promise<Post> {
    try {
      return await this.postRepository.findOne({
        where: { id },
        relations: ['user'],
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

  async findByUser(userId: string): Promise<Post[]> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      const posts = await this.postRepository.find({
        where: { user },
        order: { createdAt: 'DESC' },
      });
      return posts;
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

  async update(
    id: string,
    userId: string,
    updatePostInput: UpdatePostInput,
  ): Promise<Post> {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (post.user.id !== userId) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'You are not allowed to update this post',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      const updatedPost = this.postRepository.merge(post, updatePostInput);
      return await this.postRepository.save(updatedPost);
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

  async remove(id: string, userId: string): Promise<string> {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (post.user.id !== userId) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'You are not allowed to update this post',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      await this.postRepository.remove(post);
      return id;
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

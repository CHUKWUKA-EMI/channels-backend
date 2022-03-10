/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async create(
    createCommentInput: CreateCommentInput,
    userId: string,
  ): Promise<Comment> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      const post = await this.postRepository.findOne({
        where: { id: createCommentInput.postId },
      });
      const comment = this.commentRepository.create({
        ...createCommentInput,
        user,
      });
      const savedComment = await this.commentRepository.save(comment);
      post.numberOfComments++;
      await this.postRepository.save(post);
      return savedComment;
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

  async findAll(): Promise<Comment[]> {
    try {
      return await this.commentRepository.find({
        order: { createdAt: 'DESC' },
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

  async findOne(id: string): Promise<Comment> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      return comment;
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

  async findByPost(postId: string): Promise<Comment[]> {
    try {
      const comments = await this.commentRepository.find({
        where: { postId },
        order: { createdAt: 'DESC' },
        relations: ['user'],
      });
      return comments;
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
    updateCommentInput: UpdateCommentInput,
    userId: string,
  ): Promise<Comment> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      const comment = await this.commentRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (comment.user.id !== user.id) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'You are not authorized to update this comment',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      comment.content = updateCommentInput.content;
      return await this.commentRepository.save(comment);
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

  async remove(id: string, userId: string, postId: string): Promise<string> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      const comment = await this.commentRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (comment.user.id !== user.id) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'You are not authorized to delete this comment',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      const post = await this.postRepository.findOne({
        where: { id: postId },
      });
      post.numberOfComments--;
      await this.postRepository.save(post);
      await this.commentRepository.remove(comment);
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

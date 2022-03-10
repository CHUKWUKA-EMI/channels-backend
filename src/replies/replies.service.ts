/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/comments/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReplyInput } from './dto/create-reply.input';
import { UpdateReplyInput } from './dto/update-reply.input';
import { Reply } from './entities/reply.entity';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
  ) {}

  async create(
    createReplyInput: CreateReplyInput,
    userId: string,
  ): Promise<Reply> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      const comment = await this.commentRepository.findOne({
        where: { id: createReplyInput.commentId },
      });
      const reply = this.replyRepository.create({ ...createReplyInput, user });
      const savedReply = await this.replyRepository.save(reply);
      comment.numberOfReplies++;
      await this.commentRepository.save(comment);
      return savedReply;
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

  async findAll(): Promise<Reply[]> {
    try {
      return await this.replyRepository.find({ relations: ['user'] });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Ooops! Something broke from our end. Please retry',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<Reply> {
    try {
      const reply = await this.replyRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      return reply;
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

  async findByCommentId(commentId: string): Promise<Reply[]> {
    try {
      const replies = await this.replyRepository.find({
        where: { commentId },
        relations: ['user'],
      });
      return replies;
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
    updateReplyInput: UpdateReplyInput,
    userId: string,
  ): Promise<Reply> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      const reply = await this.replyRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (user.id !== reply.user.id) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'You are not allowed to update this reply',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      reply.content = updateReplyInput.content;
      reply.user = user;
      const savedReply = await this.replyRepository.save(reply);
      return savedReply;
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
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      const reply = await this.replyRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (reply.user.id !== user.id) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'You are not allowed to update this reply',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      const comment = await this.commentRepository.findOne({
        where: { id: reply.commentId },
      });
      comment.numberOfReplies--;
      await this.commentRepository.save(comment);
      await this.replyRepository.delete({ id });
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

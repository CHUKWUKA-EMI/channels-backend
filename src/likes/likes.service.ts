/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/comments/entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Reply } from 'src/replies/entities/reply.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateLikeInput } from './dto/create-like.input';
import { Like } from './entities/like.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
  ) {}

  async likePost(
    createLikeInput: CreateLikeInput,
    userId: string,
  ): Promise<string> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      const post = await this.postRepository.findOne({
        where: { id: createLikeInput.postId },
      });
      const like = await this.likeRepository.findOne({
        where: { postId: createLikeInput.postId },
        relations: ['user'],
      });

      if (like && like?.user?.id === user.id) {
        await this.likeRepository.remove(like);
        post.numberOfLikes--;
        await this.postRepository.save(post);
        return createLikeInput.postId;
      }

      const createdLike = this.likeRepository.create({
        ...createLikeInput,
        value: true,
        user,
      });
      await this.likeRepository.save(createdLike);
      post.numberOfLikes++;
      await this.postRepository.save(post);
      return createLikeInput.postId;
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

  async likeComment(
    createLikeInput: CreateLikeInput,
    userId: string,
  ): Promise<string> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      const comment = await this.commentRepository.findOne({
        where: { id: createLikeInput.commentId },
      });
      const like = await this.likeRepository.findOne({
        where: { commentId: createLikeInput.commentId },
        relations: ['user'],
      });
      if (like && like.user.id === user.id) {
        await this.likeRepository.remove(like);
        comment.numberOfLikes--;
        await this.commentRepository.save(comment);
        return createLikeInput.commentId;
      }

      const createdLike = this.likeRepository.create({
        ...createLikeInput,
        value: true,
        user,
      });
      await this.likeRepository.save(createdLike);
      comment.numberOfLikes++;
      await this.commentRepository.save(comment);
      return createLikeInput.commentId;
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

  async likeReply(
    createLikeInput: CreateLikeInput,
    userId: string,
  ): Promise<string> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      const reply = await this.commentRepository.findOne({
        where: { id: createLikeInput.replyId },
      });
      const like = await this.likeRepository.findOne({
        where: { replyId: createLikeInput.replyId },
        relations: ['user'],
      });
      if (like && like.user.id === user.id) {
        await this.likeRepository.remove(like);
        reply.numberOfLikes--;
        await this.replyRepository.save(reply);
        return createLikeInput.replyId;
      }

      const createdLike = this.likeRepository.create({
        ...createLikeInput,
        value: true,
        user,
      });
      await this.likeRepository.save(createdLike);
      reply.numberOfLikes++;
      await this.replyRepository.save(reply);
      return createLikeInput.replyId;
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

  async findAll(): Promise<Like[]> {
    try {
      return await this.likeRepository.find({ relations: ['user'] });
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

  async findByPost(postId: string): Promise<Like[]> {
    try {
      return await this.likeRepository.find({
        where: { postId },
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

  async findByComment(commentId: string): Promise<Like[]> {
    try {
      return await this.likeRepository.find({
        where: { commentId },
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

  async findByReply(replyId: string): Promise<Like[]> {
    try {
      return await this.likeRepository.find({
        where: { replyId },
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
}

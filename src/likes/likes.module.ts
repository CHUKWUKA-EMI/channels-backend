/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesResolver } from './likes.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Reply } from 'src/replies/entities/reply.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  // imports: [UsersModule, PostsModule, CommentsModule, RepliesModule],
  imports: [TypeOrmModule.forFeature([Like, User, Post, Comment, Reply])],
  providers: [LikesResolver, LikesService],
})
export class LikesModule {}

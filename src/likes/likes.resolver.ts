/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { LikesService } from './likes.service';
import { Like } from './entities/like.entity';
import { CreateLikeInput } from './dto/create-like.input';
import { Inject, UseGuards } from '@nestjs/common';
import { CurrentUser, GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';

@Resolver(() => Like)
export class LikesResolver {
  constructor(
    @Inject(PUB_SUB) private readonly pubsub: RedisPubSub,
    private readonly likesService: LikesService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async likePost(
    @Args('createLikeInput') createLikeInput: CreateLikeInput,
    @CurrentUser() user,
  ) {
    const newLike = await this.likesService.likePost(
      createLikeInput,
      user.userId,
    );
    this.pubsub.publish('postLiked', { postLiked: newLike });
    return newLike;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async likeComment(
    @Args('createLikeInput') createLikeInput: CreateLikeInput,
    @CurrentUser() user,
  ) {
    const newLike = await this.likesService.likeComment(
      createLikeInput,
      user.userId,
    );
    this.pubsub.publish('commentLiked', { commentLiked: newLike });
    return newLike;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async likeReply(
    @Args('createLikeInput') createLikeInput: CreateLikeInput,
    @CurrentUser() user,
  ) {
    const newLike = await this.likesService.likeReply(
      createLikeInput,
      user.userId,
    );
    this.pubsub.publish('replyLiked', { replyLiked: newLike });
    return newLike;
  }

  @Query(() => [Like], { name: 'likes' })
  findAll() {
    return this.likesService.findAll();
  }

  @Query(() => [Like], { name: 'postLikes' })
  findByPost(@Args('postId') postId: string) {
    return this.likesService.findByPost(postId);
  }

  @Query(() => [Like], { name: 'commentLikes' })
  findByComment(@Args('commentId') commentId: string) {
    return this.likesService.findByComment(commentId);
  }

  @Query(() => [Like], { name: 'replyLikes' })
  findByReply(@Args('replyId') replyId: string) {
    return this.likesService.findByReply(replyId);
  }

  @Subscription(() => String, {
    filter: (payload, variables) => {
      return payload.postLiked === variables.postId;
    },
  })
  postLiked(@Args('postId') postId: string) {
    console.log('subscribed to post', postId);
    return this.pubsub.asyncIterator('postLiked');
  }

  @Subscription(() => String, {
    filter: (payload, variables) => {
      return payload.commentLiked === variables.commentId;
    },
  })
  commentLiked(@Args('commentId') commentId: string) {
    console.log('subscribed to comment', commentId);
    return this.pubsub.asyncIterator('commentLiked');
  }

  @Subscription(() => String, {
    filter: (payload, variables) => {
      return payload.replyLiked === variables.replyId;
    },
  })
  replyLiked(@Args('replyId') replyId: string) {
    console.log('subscribed to reply', replyId);
    return this.pubsub.asyncIterator('replyLiked');
  }
}

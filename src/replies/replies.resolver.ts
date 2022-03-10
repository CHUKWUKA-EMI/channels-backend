/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { RepliesService } from './replies.service';
import { Reply } from './entities/reply.entity';
import { CreateReplyInput } from './dto/create-reply.input';
import { UpdateReplyInput } from './dto/update-reply.input';
import { Inject, UseGuards } from '@nestjs/common';
import { CurrentUser, GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';

@Resolver(() => Reply)
export class RepliesResolver {
  constructor(
    @Inject(PUB_SUB) private readonly pubsub: RedisPubSub,
    private readonly repliesService: RepliesService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Reply)
  async createReply(
    @Args('createReplyInput') createReplyInput: CreateReplyInput,
    @CurrentUser() user,
  ) {
    const newReply = await this.repliesService.create(
      createReplyInput,
      user.userId,
    );
    this.pubsub.publish('replyAdded', { replyAdded: newReply });
    return newReply;
  }

  @Query(() => [Reply], { name: 'replies' })
  findAll() {
    return this.repliesService.findAll();
  }

  @Query(() => Reply, { name: 'reply' })
  findOne(@Args('id') id: string) {
    return this.repliesService.findOne(id);
  }

  @Mutation(() => Reply)
  updateReply(
    @Args('updateReplyInput') updateReplyInput: UpdateReplyInput,
    @CurrentUser() user,
  ) {
    return this.repliesService.update(
      updateReplyInput.id,
      updateReplyInput,
      user.userId,
    );
  }

  @Mutation(() => Reply)
  removeReply(@Args('id') id: string, @CurrentUser() user) {
    return this.repliesService.remove(id, user.userId);
  }

  @Subscription(() => Reply, {
    filter: (payload, variables) => {
      return payload.replyAdded.commentId === variables.commentId;
    },
  })
  replyAdded(@Args('commentId') commentId: string) {
    console.log('subscribed to comment: ', commentId);
    return this.pubsub.asyncIterator('replyAdded');
  }
}

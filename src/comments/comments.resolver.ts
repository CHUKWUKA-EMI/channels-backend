/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { Inject, Request, UseGuards } from '@nestjs/common';
import { CurrentUser, GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(
    @Inject(PUB_SUB) private readonly pubsub: RedisPubSub,
    private readonly commentsService: CommentsService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  async createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @CurrentUser() user,
  ) {
    const newComment = await this.commentsService.create(
      createCommentInput,
      user.userId,
    );

    this.pubsub.publish('commentAdded', {
      commentAdded: newComment,
    });
    return newComment;
  }

  @Query(() => [Comment], { name: 'comments' })
  findAll() {
    return this.commentsService.findAll();
  }

  @Query(() => Comment, { name: 'comment' })
  findOne(@Args('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Query(() => [Comment], { name: 'commentsByPost' })
  findAllByPost(@Args('postId') postId: string) {
    return this.commentsService.findByPost(postId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @CurrentUser() user,
  ) {
    const updatedComment = await this.commentsService.update(
      updateCommentInput.id,
      updateCommentInput,
      user.userId,
    );
    this.pubsub.publish('commentUpdated', { commentUpdated: updatedComment });
    return updatedComment;
  }

  @Mutation(() => Comment)
  removeComment(
    @Args('id') id: string,
    @Args('postId') postId: string,
    @Request() req: Request,
  ) {
    return this.commentsService.remove(id, (<any>req).userId, postId);
  }

  @Subscription(() => Comment, {
    filter: (payload, variables) => {
      return payload.commentAdded.postId === variables.postId;
    },
  })
  commentAdded(@Args('postId') postId: string) {
    console.log('subscribed to post', postId);
    return this.pubsub.asyncIterator('commentAdded');
  }

  @Subscription(() => Comment, {
    filter: (payload, variables) =>
      payload.commentAdded.postId === variables.postId,
  })
  commentUpdated(@Args('postId') postId: string) {
    console.log('subscribed to post', postId);
    return this.pubsub.asyncIterator('commentUpdated');
  }
}

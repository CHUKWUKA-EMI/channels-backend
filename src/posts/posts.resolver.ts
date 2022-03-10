/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Inject, UseGuards } from '@nestjs/common';
import { CurrentUser, GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    @Inject(PUB_SUB) private readonly pubsub: RedisPubSub,
    private readonly postsService: PostsService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async createPost(
    @CurrentUser() user,
    @Args('createPostInput')
    createPostInput: CreatePostInput,
  ) {
    try {
      const newPost = await this.postsService.create(
        createPostInput,
        user.userId,
      );
      this.pubsub.publish('postAdded', { postAdded: newPost });
      return newPost;
    } catch (e) {
      console.log('post creation error: ', e);
    }
  }

  @Query(() => [Post], { name: 'posts' })
  findAll() {
    return this.postsService.findAll();
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Post], { name: 'findAllByUser' })
  findAllByUser(@CurrentUser() user) {
    return this.postsService.findByUser(user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  updatePost(
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
    @CurrentUser() user,
  ) {
    return this.postsService.update(
      updatePostInput.id,
      user.userId,
      updatePostInput,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  removePost(@Args('id') id: string, @CurrentUser() user) {
    return this.postsService.remove(id, user.userId);
  }

  @Subscription(() => Post, {
    // filter: (payload, variables) => {
    //   return payload.postAdded.userId === variables.userId;
    // }
  })
  postAdded() {
    return this.pubsub.asyncIterator('postAdded');
  }
}

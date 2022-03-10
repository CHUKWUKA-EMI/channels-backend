/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import ORMConfig from 'ormconfig';
import { join } from 'path';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { RepliesModule } from './replies/replies.module';
import { JwtService } from '@nestjs/jwt';
import { PubsubModule } from './pubsub/pubsub.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exception-filter';

@Module({
  imports: [
    TypeOrmModule.forRoot(ORMConfig),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      debug: true,
      path: '/api/v1/graphql',
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: (connectionParams) => {
            const authPayload = connectionParams.Authorization;
            if (!authPayload) {
              throw new Error('Token not found');
            }

            const token = authPayload.split(' ')[1];
            const jwtService = new JwtService({
              secret: process.env.JWT_SECRET,
            });
            const user = jwtService.verify(token);
            if (user.exp < Date.now() / 1000) {
              throw new Error('Token expired');
            }
            return user;
          },
        },
      },
      context: () => {
        // console.log('extra', extra);
        // you can now access your additional context value through the extra field
      },
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    LikesModule,
    RepliesModule,
    PubsubModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}

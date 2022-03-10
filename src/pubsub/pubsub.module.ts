/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { createClient } from 'redis';

export const PUB_SUB = 'PUB_SUB';

@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      useFactory: async () => {
        // return new PubSub();
        const redisClient = createClient({
          url: process.env.REDIS_URL,
          socket: {
            reconnectStrategy: (retries) => Math.min(retries * 50, 100),
          },
        });
        const subscriber = redisClient.duplicate();
        await redisClient.connect();
        await subscriber.connect();
        return new RedisPubSub({
          subscriber,
          publisher: redisClient,
        });
      },
    },
  ],
  exports: [PUB_SUB],
})
export class PubsubModule {}

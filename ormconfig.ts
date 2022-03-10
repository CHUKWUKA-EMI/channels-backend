/* eslint-disable prettier/prettier */
import { Comment } from 'src/comments/entities/comment.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Reply } from 'src/replies/entities/reply.entity';
import { User } from 'src/users/entities/user.entity';
import { ConnectionOptions } from 'typeorm';

const ORMConfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  url:process.env.DB_URL,
  synchronize: false,
  logging: true,
  migrationsRun: false,
  entities: [User, Post, Comment, Like, Reply],
  migrations: ['dist/src/migration/*.js'],
  cli: {
    migrationsDir: 'src/migration',
  },
};

export default ORMConfig;

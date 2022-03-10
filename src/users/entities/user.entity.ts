/* eslint-disable prettier/prettier */
import { ObjectType, Field } from '@nestjs/graphql';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Reply } from 'src/replies/entities/reply.entity';

enum UserTypes {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ nullable: false })
  @Field({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  @Field({ nullable: false })
  lastName: string;

  @Column({ nullable: false })
  @Field({ nullable: false })
  userName: string;

  @Column({ unique: true, nullable: false })
  @Field({ nullable: false })
  email: string;

  @Column({ nullable: false })
  @Exclude({ toPlainOnly: true })
  @Field({ nullable: false })
  password: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  imageUrl: string;

  @Column({ default: false })
  @Field()
  isVerified: boolean;

  @Column({ default: UserTypes.USER })
  @Field()
  userRole: UserTypes;

  @OneToMany(() => Post, (post) => post.user, { onDelete: 'CASCADE' })
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user, { onDelete: 'CASCADE' })
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user, { onDelete: 'CASCADE' })
  likes: Like[];

  @OneToMany(() => Reply, (reply) => reply.user, { onDelete: 'CASCADE' })
  replies: Reply[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(11);
    this.password = await bcrypt.hash(this.password, salt);
  }
}

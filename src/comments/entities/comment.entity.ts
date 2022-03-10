/* eslint-disable prettier/prettier */
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ type: 'text', nullable: false })
  @Field()
  content: string;

  @ManyToOne(() => User, (user) => user.comments)
  @Field(() => User)
  user: User;

  @Column()
  @Field()
  postId: string;

  @Column({ default: 0 })
  @Field(() => Int)
  numberOfLikes: number;

  @Column({ default: 0 })
  @Field(() => Int)
  numberOfReplies: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}

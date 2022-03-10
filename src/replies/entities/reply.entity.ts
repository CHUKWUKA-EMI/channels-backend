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

@Entity({ name: 'replies' })
@ObjectType()
export class Reply {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ type: 'text', nullable: false })
  @Field()
  content: string;

  @ManyToOne(() => User, (user) => user.replies)
  @Field(() => User)
  user: User;

  @Column({ default: 0 })
  @Field(() => Int)
  numberOfLikes: number;

  @Column({ nullable: false })
  @Field()
  commentId: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}

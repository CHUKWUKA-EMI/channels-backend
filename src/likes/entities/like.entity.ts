/* eslint-disable prettier/prettier */
import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'likes' })
@ObjectType()
export class Like {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ nullable: false })
  @Field()
  value: boolean;

  @ManyToOne(() => User, (user) => user.likes)
  @Field(() => User)
  user: User;

  @Column({ nullable: true })
  @Field({ nullable: true })
  postId: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  commentId: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  replyId: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}

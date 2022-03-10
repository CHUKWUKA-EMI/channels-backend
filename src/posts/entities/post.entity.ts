/* eslint-disable prettier/prettier */
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import slugify from 'slugify';

@Entity({ name: 'posts' })
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ nullable: false })
  @Field()
  title: string;

  @Column({ nullable: false })
  @Field()
  slug: string;

  @Column({ type: 'text', nullable: false })
  @Field()
  content: string;

  @Column({ default: 0 })
  @Field(() => Int)
  numberOfComments: number;

  @Column({ default: 0 })
  @Field(() => Int)
  numberOfLikes: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => User, (user) => user.posts)
  @Field(() => User)
  user: User;

  @Column('tsvector', { select: false })
  search_document_with_weights: any;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @BeforeInsert()
  generateSlug() {
    this.slug = slugify(this.id.slice(0, 9) + this.title, '-');
  }

  @BeforeUpdate()
  updateSlug() {
    this.slug = slugify(this.id.slice(0, 9) + this.title, '-');
  }
}

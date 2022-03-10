/* eslint-disable prettier/prettier */
import { CreatePostInput } from './create-post.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
  @IsString()
  @Field({ nullable: false })
  id: string;

  @IsString()
  @Field({ nullable: true })
  title?: string;

  @IsString()
  @Field({ nullable: true })
  content?: string;

  @IsString()
  @Field({ nullable: true })
  imageUrl?: string;
}

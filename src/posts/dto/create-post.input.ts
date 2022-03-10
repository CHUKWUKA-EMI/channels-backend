/* eslint-disable prettier/prettier */
import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreatePostInput {
  @IsString()
  @Field({ nullable: false })
  title: string;

  @IsString()
  @Field({ nullable: false })
  content: string;

  @IsString()
  @Field({ nullable: true })
  imageUrl?: string;
}

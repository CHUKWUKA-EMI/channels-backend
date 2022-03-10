/* eslint-disable prettier/prettier */
import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateReplyInput {
  @IsString()
  @Field({ nullable: false })
  content: string;

  @IsString()
  @Field({ nullable: false })
  commentId: string;
}

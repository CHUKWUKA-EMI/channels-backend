/* eslint-disable prettier/prettier */
import { CreateReplyInput } from './create-reply.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateReplyInput extends PartialType(CreateReplyInput) {
  @IsString()
  @Field({nullable: false})
  id: string;

  @IsString()
  @Field({ nullable: false })
  content: string;
}

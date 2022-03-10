/* eslint-disable prettier/prettier */
import { CreateCommentInput } from './create-comment.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateCommentInput extends PartialType(CreateCommentInput) {
  @Field({nullable:false})
  id: string;

  @IsString()
  @Field({nullable:false})
  content: string;
}

import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateLikeInput {
  @IsString()
  @Field({ nullable: true })
  postId?: string;

  @IsString()
  @Field({ nullable: true })
  commentId?: string;

  @IsString()
  @Field({ nullable: true })
  replyId?: string;
}

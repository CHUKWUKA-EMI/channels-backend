/* eslint-disable prettier/prettier */
import { CreateLikeInput } from './create-like.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsBoolean } from 'class-validator';

@InputType()
export class UpdateLikeInput extends PartialType(CreateLikeInput) {
  @Field({nullable: false})
  id: string;

  @IsBoolean()
  @Field({ nullable: false })
  value: boolean;
}

/* eslint-disable prettier/prettier */
import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsEmail, IsString, IsAlpha } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @IsAlpha()
  @Field({ nullable: true })
  firstName?: string;

  @IsAlpha()
  @Field({ nullable: true })
  lastName?: string;

  @IsAlpha()
  @Field({ nullable: true })
  userName?: string;

  @IsEmail()
  @Field({ nullable: true })
  email?: string;

  @IsString()
  @Field({ nullable: true })
  imageUrl?: string;
}

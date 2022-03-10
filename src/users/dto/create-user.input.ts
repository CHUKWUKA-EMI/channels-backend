/* eslint-disable prettier/prettier */
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsAlpha, Min } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsAlpha()
  @Field()
  firstName: string;

  @IsAlpha()
  @Field()
  lastName: string;

  @IsAlpha()
  @Field()
  userName: string;

  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @Min(6, { message: 'Password length must not be less than six' })
  @Field()
  password: string;

  @IsString()
  @Field({ nullable: true })
  imageUrl?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateMemberDto {
  
  @ApiProperty()
  @IsNotEmpty({ message: 'Username should not be empty' })
  @IsString()
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  readonly password: string;
}
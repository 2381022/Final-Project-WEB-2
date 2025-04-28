import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMemberDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly username?: string;

  // Password updates often handled separately
}
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAdminDto {
  @ApiProperty()  
  @IsOptional()
  @IsString()
  readonly username?: string;

  // Password updates are often handled via a separate endpoint/DTO for security
}
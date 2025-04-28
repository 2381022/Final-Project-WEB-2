import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePengelolaanMemberDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  readonly jadwalId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  readonly memberId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  readonly adminId: number; // Admin performing the action

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly status: string; // e.g., 'Registered', 'Attended', 'Cancelled'
}
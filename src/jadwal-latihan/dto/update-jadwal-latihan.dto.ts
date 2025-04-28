import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateJadwalLatihanDto {
  
  @ApiProperty()
  @IsOptional()
  @IsDateString()
  readonly tanggal?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/, {
      message: 'Jam must be in HH:MM or HH:MM:SS format'
  })
  readonly jam?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly tempat?: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  readonly adminId?: number; // Potentially allow changing the responsible admin
}
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { AbsensiStatus } from './create-absensi.dto'; // Reuse enum
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAbsensiDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  readonly memberId?: number; // Usually not changed, but possible

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEnum(AbsensiStatus, { message: 'Status must be one of: Hadir, Izin, Sakit, Alpa' })
  readonly status?: AbsensiStatus; // Or string if not using enum
}
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

// Define possible statuses explicitly if desired
export enum AbsensiStatus {
    HADIR = 'Hadir',
    IZIN = 'Izin',
    SAKIT = 'Sakit',
    ALPA = 'Alpa',
}

export class CreateAbsensiDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  readonly memberId: number;

  // Tanggal is usually set automatically by @CreateDateColumn

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(AbsensiStatus, { message: 'Status must be one of: Hadir, Izin, Sakit, Alpa' }) // Use enum for validation
  readonly status: AbsensiStatus; // Or string if not using enum
}
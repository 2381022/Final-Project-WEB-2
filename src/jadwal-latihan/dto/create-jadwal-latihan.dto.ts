import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateJadwalLatihanDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString() // Expects YYYY-MM-DD format
  readonly tanggal: string; // Use string for transport, convert in service if needed

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/, { // Basic HH:MM or HH:MM:SS format
      message: 'Jam must be in HH:MM or HH:MM:SS format'
  })
  readonly jam: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly tempat: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  readonly adminId: number; // ID of the admin creating the schedule
}
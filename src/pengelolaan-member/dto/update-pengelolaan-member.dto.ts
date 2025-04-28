import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePengelolaanMemberDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly status?: string;
  // Usually, you wouldn't update the IDs (jadwalId, memberId, adminId) here.
  // To change those, you'd typically delete and recreate the record.
}
import { MemberResponseDto } from '../../member/dto/member.response.dto'; // Adjust path

export class AbsensiResponseDto {
  readonly id: number;
  readonly tanggal: Date;
  readonly status: string;
  readonly member: MemberResponseDto | number; // Nested member info or just ID

  constructor(partial: Partial<AbsensiResponseDto>) {
    Object.assign(this, partial);
  }
}
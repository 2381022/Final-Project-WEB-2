import { AdminResponseDto } from '../../admin/dto/admin.response.dto'; // Adjust path

export class JadwalLatihanResponseDto {
  readonly id: number;
  readonly tanggal: Date | string; // Can be Date object or formatted string
  readonly jam: string;
  readonly tempat: string;
  readonly admin: AdminResponseDto | number; // Can return nested Admin info or just the ID

  constructor(partial: Partial<JadwalLatihanResponseDto>) {
    Object.assign(this, partial);
  }
}
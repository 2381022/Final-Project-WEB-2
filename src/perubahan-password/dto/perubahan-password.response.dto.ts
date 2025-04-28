export class PerubahanPasswordResponseDto {
    readonly id: number;
    readonly tanggal: Date;
    readonly roleUser: string;
    readonly adminId?: number; // Include if present
    readonly memberId?: number; // Include if present
  
    constructor(partial: Partial<PerubahanPasswordResponseDto>) {
      Object.assign(this, partial);
    }
  }
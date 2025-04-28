// Option 1: Return only IDs
export class PengelolaanMemberResponseDto {
    readonly jadwalId: number;
    readonly memberId: number;
    readonly adminId: number;
    readonly status: string;

    constructor(partial: Partial<PengelolaanMemberResponseDto>) {
        Object.assign(this, partial);
    }
}

/*
// Option 2: Return nested objects (can become large)
import { JadwalLatihanResponseDto } from '../../jadwal-latihan/dto'; // Adjust path
import { MemberResponseDto } from '../../member/dto'; // Adjust path
import { AdminResponseDto } from '../../admin/dto'; // Adjust path

export class PengelolaanMemberNestedResponseDto {
    readonly status: string;
    readonly jadwal: JadwalLatihanResponseDto;
    readonly member: MemberResponseDto;
    readonly admin: AdminResponseDto;

    constructor(partial: Partial<PengelolaanMemberNestedResponseDto>) {
        Object.assign(this, partial);
    }
}
*/
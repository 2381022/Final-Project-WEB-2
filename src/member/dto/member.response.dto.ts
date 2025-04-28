export class MemberResponseDto {
    readonly id: number;
    readonly username: string;
    // Exclude password hash
  
    constructor(partial: Partial<MemberResponseDto>) {
      Object.assign(this, partial);
    }
  }
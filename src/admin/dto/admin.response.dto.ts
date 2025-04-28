// This DTO defines the data sent back to the client, excluding sensitive info

export class AdminResponseDto {
    readonly id: number;
    readonly username: string;
    // Exclude password hash
  
    constructor(partial: Partial<AdminResponseDto>) {
      Object.assign(this, partial);
    }
  }
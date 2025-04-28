import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export enum UserRoleLog { // Renamed to avoid conflict if UserRole exists elsewhere
    ADMIN = 'admin',
    MEMBER = 'member',
}

export class CreatePerubahanPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserRoleLog)
  readonly roleUser: UserRoleLog;

  @ApiProperty()
  @ValidateIf(o => o.roleUser === UserRoleLog.ADMIN) // Validate only if role is admin
  @IsNotEmpty({ message: 'adminId is required when roleUser is admin' })
  @IsInt()
  readonly adminId?: number;

  @ApiProperty()
  @ValidateIf(o => o.roleUser === UserRoleLog.MEMBER) // Validate only if role is member
  @IsNotEmpty({ message: 'memberId is required when roleUser is member' })
  @IsInt()
  readonly memberId?: number;

  // Add validation to ensure only one ID is provided (can be complex with class-validator alone, might need service logic)
  // Tanggal is usually set automatically by @CreateDateColumn
}
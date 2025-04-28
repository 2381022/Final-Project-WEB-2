import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerubahanPasswordController } from './perubahan-password.controller';
import { PerubahanPasswordService } from './perubahan-password.service';
import { PerubahanPassword } from './PerubahanPassword.entity';
import { Admin } from '../admin/admin.entity';     // Related entity
import { Member } from '../member/member.entity';   // Related entity
import {  JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PerubahanPassword, // Entity for this module
      Admin,             // Repository needed by service
      Member,            // Repository needed by service
    ]),
  ],
  controllers: [PerubahanPasswordController],
  providers: [PerubahanPasswordService, JwtService],
  exports: [PerubahanPasswordService] // Export service if needed by Admin/Member modules for logging
})
export class PerubahanPasswordModule {}
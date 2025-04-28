import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PengelolaanMemberController } from './pengelolaan-member.controller';
import { PengelolaanMemberService } from './pengelolaan-member.service';
import { PengelolaanMember } from './PengelolaanMember.entity';
import { JadwalLatihan } from '../jadwal-latihan/JadwalLatihan.entity'; // Related entity
import { Member } from '../member/member.entity';                   // Related entity
import { Admin } from '../admin/admin.entity';                     // Related entity
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PengelolaanMember, // Entity for this module
      JadwalLatihan,     // Repository needed by service
      Member,            // Repository needed by service
      Admin,             // Repository needed by service
    ]),
  ],
  controllers: [PengelolaanMemberController],
  providers: [PengelolaanMemberService, JwtService],
})
export class PengelolaanMemberModule {}
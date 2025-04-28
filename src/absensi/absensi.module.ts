import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbsensiController } from './absensi.controller';
import { AbsensiService } from './absensi.service';
import { Absensi } from './Absensi.entity';
import { Member } from '../member/member.entity'; // Import related entity needed by service
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        Absensi, // Entity for this module
        Member,  // Entity whose repository is needed by AbsensiService
        ]),
  ],
  controllers: [AbsensiController],
  providers: [AbsensiService, JwtService],
})
export class AbsensiModule {}
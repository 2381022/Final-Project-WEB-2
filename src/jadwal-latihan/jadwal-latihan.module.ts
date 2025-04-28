import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JadwalLatihanController } from './jadwal-latihan.controller';
import { JadwalLatihanService } from './jadwal-latihan.service';
import { JadwalLatihan } from './JadwalLatihan.entity';
import { Admin } from '../admin/admin.entity'; // Import related entity needed by service
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        JadwalLatihan, // Entity for this module
        Admin,         // Entity whose repository is needed by JadwalLatihanService
        ]),
  ],
  controllers: [JadwalLatihanController],
  providers: [JadwalLatihanService, JwtService],
  // No exports needed typically unless another module specifically needs JadwalLatihanService
})
export class JadwalLatihanModule {}
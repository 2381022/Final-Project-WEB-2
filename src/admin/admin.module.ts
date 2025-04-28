import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
// Import JwtService/ConfigService if AuthGuard is provided here,
// but usually AuthGuard is provided in AppModule or AuthModule.

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, User]), // Register Admin entity for this module
    // If AuthGuard provided here: JwtModule, ConfigModule
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    JwtService
    ],
  exports: [AdminService] // Export service if needed by other modules (e.g., Auth)
})
export class AdminModule {}
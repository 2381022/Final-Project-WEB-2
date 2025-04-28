import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { Member } from './member.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]), // Register Member entity
  ],
  controllers: [MemberController],
  providers: [MemberService, JwtService],
  exports: [MemberService] // Export service if needed by other modules (e.g., Auth)
})
export class MemberModule {}
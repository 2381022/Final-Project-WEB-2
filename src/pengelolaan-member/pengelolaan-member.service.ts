import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PengelolaanMember } from './PengelolaanMember.entity';
import { CreatePengelolaanMemberDto, UpdatePengelolaanMemberDto } from './dto';
import { JadwalLatihan } from '../jadwal-latihan/JadwalLatihan.entity';
import { Admin } from 'src/admin/admin.entity';
import { Member } from 'src/member/member.entity';


@Injectable()
export class PengelolaanMemberService {
  constructor(
    @InjectRepository(PengelolaanMember)
    private readonly pmRepository: Repository<PengelolaanMember>,
    @InjectRepository(JadwalLatihan)
    private readonly jadwalRepository: Repository<JadwalLatihan>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(createDto: CreatePengelolaanMemberDto): Promise<PengelolaanMember> {
    // Find related entities
    const jadwal = await this.jadwalRepository.findOneBy({ id: createDto.jadwalId });
    if (!jadwal) throw new NotFoundException(`Schedule with ID ${createDto.jadwalId} not found`);

    const member = await this.memberRepository.findOneBy({ id: createDto.memberId });
    if (!member) throw new NotFoundException(`Member with ID ${createDto.memberId} not found`);

    const admin = await this.adminRepository.findOneBy({ id: createDto.adminId });
    if (!admin) throw new NotFoundException(`Admin with ID ${createDto.adminId} not found`);

    // Check if this combination already exists (optional, DB constraint handles it too)
    const existing = await this.pmRepository.findOneBy({
        jadwalId: createDto.jadwalId,
        memberId: createDto.memberId
    });
    if (existing) {
        throw new BadRequestException(`Member ${createDto.memberId} is already managed for schedule ${createDto.jadwalId}`);
    }

    // Create the new management record instance
    const newPm : PengelolaanMember = this.pmRepository.create({
        jadwalId: createDto.jadwalId,  // karena memang ada @PrimaryColumn jadwalId
        memberId: createDto.memberId,  // karena memang ada @PrimaryColumn memberId
        status: createDto.status,
        jadwal: { id: createDto.jadwalId },  // supaya relasi jadwal ikut terhubung
        member: { id: createDto.memberId },
        admin: { id: createDto.adminId },
      });
    try {
      return await this.pmRepository.save(newPm);
    } catch (error) {
        // Log error (e.g., constraint violations)
        throw new BadRequestException('Could not create member management record.');
    }
  }

  // Find all - potentially with filters for jadwalId or memberId
  async findAll(filter?: { jadwalId?: number; memberId?: number }): Promise<PengelolaanMember[]> {
      const whereClause: any = {};
      if (filter?.jadwalId) whereClause.jadwalId = filter.jadwalId;
      if (filter?.memberId) whereClause.memberId = filter.memberId;

      return this.pmRepository.find({
          where: whereClause,
          relations: ['jadwal', 'member', 'admin'], // Load relations if needed for response
      });
  }

  async findOne(jadwalId: number, memberId: number): Promise<PengelolaanMember> {
    const pm = await this.pmRepository.findOne({
      where: { jadwalId, memberId }, // Use composite key parts
      relations: ['jadwal', 'member', 'admin'], // Load relations
    });
    if (!pm) {
      throw new NotFoundException(`Management record for schedule ${jadwalId} and member ${memberId} not found`);
    }
    return pm;
  }

  // Update focuses mainly on the 'status'
  async update(jadwalId: number, memberId: number, updateDto: UpdatePengelolaanMemberDto): Promise<PengelolaanMember> {
    const pm = await this.findOne(jadwalId, memberId); // Ensure record exists

    // Only update allowed fields (like status)
    pm.status = updateDto.status ?? pm.status;
    // Potentially update admin if logic requires tracking who last updated? Requires adding adminId to Update DTO.

    try {
      return await this.pmRepository.save(pm);
    } catch (error) {
       // Log error
       throw new BadRequestException('Could not update member management record.');
    }
  }

  async remove(jadwalId: number, memberId: number): Promise<void> {
    const pm = await this.findOne(jadwalId, memberId); // Ensure exists
    const result = await this.pmRepository.delete({ jadwalId, memberId }); // Delete by composite key

    if (result.affected === 0) {
      throw new NotFoundException(`Management record for schedule ${jadwalId} and member ${memberId} not found`);
    }
  }
}
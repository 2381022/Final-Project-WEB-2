import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Absensi } from './Absensi.entity';
import { CreateAbsensiDto, UpdateAbsensiDto } from './dto';
import { Member } from 'src/member/member.entity';

@Injectable()
export class AbsensiService {
  constructor(
    @InjectRepository(Absensi)
    private readonly absensiRepository: Repository<Absensi>,
    @InjectRepository(Member) // Inject Member repository
    private readonly memberRepository: Repository<Member>,
  ) {}

  async create(createDto: CreateAbsensiDto): Promise<Absensi> {
    const member = await this.memberRepository.findOneBy({ id: createDto.memberId });
    if (!member) {
      throw new NotFoundException(`Member with ID ${createDto.memberId} not found`);
    }

    // Create instance, tanggal is handled by @CreateDateColumn
    const newAbsensi = this.absensiRepository.create({
      status: createDto.status,
      member: member, // Associate the found member
    });

    try {
      return await this.absensiRepository.save(newAbsensi);
    } catch (error) {
        // Log error
        throw new BadRequestException('Could not create attendance record.');
    }
  }

  async findAll(): Promise<Absensi[]> {
    // Load 'member' relation
    return this.absensiRepository.find({ relations: ['member'] });
  }

  // Consider adding filters (e.g., find by memberId, find by date range)
  async findByMember(memberId: number): Promise<Absensi[]> {
      return this.absensiRepository.find({
          where: { member: { id: memberId } },
          relations: ['member'],
          order: { tanggal: 'DESC' } // Example ordering
      });
  }

  async findOne(id: number): Promise<Absensi> {
    const absensi = await this.absensiRepository.findOne({
      where: { id },
      relations: ['member'], // Load relation
    });
    if (!absensi) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    return absensi;
  }

  async update(id: number, updateDto: UpdateAbsensiDto): Promise<Absensi> {
    const absensi = await this.findOne(id); // Handles not found and loads relation

    let member: Member | undefined = absensi.member; // Keep current member

    // If memberId is provided and different, find the new member
    if (updateDto.memberId && updateDto.memberId !== member.id) {
        const tmp = await this.memberRepository.findOneBy({ id: updateDto.memberId });
        if(tmp){
            member = tmp
        }

      if (!member) {
        throw new NotFoundException(`Member with ID ${updateDto.memberId} not found for update`);
      }
    }

    // Exclude memberId from direct merge
    const { memberId, ...updateData } = updateDto;
    this.absensiRepository.merge(absensi, updateData);
    absensi.member = member; // Update association

    try {
      return await this.absensiRepository.save(absensi);
    } catch (error) {
        // Log error
        throw new BadRequestException('Could not update attendance record.');
    }
  }

  async remove(id: number): Promise<void> {
    const absensi = await this.findOne(id); // Ensure exists
    const result = await this.absensiRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
  }
}
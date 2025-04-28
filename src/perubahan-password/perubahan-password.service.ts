import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerubahanPassword, UserRole } from './PerubahanPassword.entity'; // Pakai UserRole dari entity
import { CreatePerubahanPasswordDto, UserRoleLog } from './dto';
import { Admin } from 'src/admin/admin.entity';
import { Member } from 'src/member/member.entity';

@Injectable()
export class PerubahanPasswordService {
  constructor(
    @InjectRepository(PerubahanPassword)
    private readonly ppRepository: Repository<PerubahanPassword>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async logPasswordChange(createDto: CreatePerubahanPasswordDto): Promise<PerubahanPassword> {
    let admin: Admin = new Admin;
    let member: Member = new Member ;

    if (createDto.roleUser === UserRoleLog.ADMIN) {
        if (!createDto.adminId || createDto.memberId) {
            throw new BadRequestException('Admin role requires adminId and no memberId.');
        }
        const tmp = await this.adminRepository.findOneBy({ id: createDto.adminId });
        if(tmp){
            admin = tmp 
        }else{
            throw new NotFoundException(`Admin with ID ${createDto.adminId} not found.`);
        }
    } else if (createDto.roleUser === UserRoleLog.MEMBER) {
        if (!createDto.memberId || createDto.adminId) {
            throw new BadRequestException('Member role requires memberId and no adminId.');
        }
        
        const tmp2 = await this.memberRepository.findOneBy({ id: createDto.memberId });
        if(tmp2){
            member = tmp2
        }else{
            throw new NotFoundException(`Member with ID ${createDto.memberId} not found.`);
        }
    } else {
        throw new BadRequestException('Invalid roleUser specified.');
    }

    // Create the log entry instance
    const logEntry: PerubahanPassword = this.ppRepository.create({
        roleUser: createDto.roleUser as unknown as UserRole, // <--- MAGIC CAST
        admin: admin,
        member: member,
    });

    try {
        return await this.ppRepository.save(logEntry);
    } catch (error) {
        throw new BadRequestException('Could not log password change.');
    }
}




  async findAll(filter?: { adminId?: number; memberId?: number }): Promise<PerubahanPassword[]> {
    const whereClause: any = {};
    if (filter?.adminId) whereClause.admin = { id: filter.adminId };
    if (filter?.memberId) whereClause.member = { id: filter.memberId };

    return this.ppRepository.find({
      where: whereClause,
      relations: ['admin', 'member'],
      order: { tanggal: 'DESC' },
    });
  }

  async findOne(id: number): Promise<PerubahanPassword> {
    const logEntry = await this.ppRepository.findOne({
      where: { id },
      relations: ['admin', 'member'],
    });
    if (!logEntry) {
      throw new NotFoundException(`Password change log with ID ${id} not found.`);
    }
    return logEntry;
  }
}

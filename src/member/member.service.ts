import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Member } from './member.entity';
import { CreateMemberDto, UpdateMemberDto } from './dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const existingMember = await this.memberRepository.findOneBy({ username: createMemberDto.username });
    if (existingMember) {
      throw new ConflictException('Username already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createMemberDto.password, saltRounds);

    const newMember = this.memberRepository.create({
      ...createMemberDto,
      password: hashedPassword,
    });

    try {
        return await this.memberRepository.save(newMember);
    } catch (error) {
        throw new BadRequestException('Could not create member.');
    }
  }

  async findAll(): Promise<Member[]> {
    return this.memberRepository.find(); // Password excluded by entity config
  }

  async findOne(id: number): Promise<Member> {
    const member = await this.memberRepository.findOneBy({ id });
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member; // Password excluded by entity config
  }

  async findByUsername(username: string): Promise<Member | null> {
    return this.memberRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password'],
    });
  }
  

  async update(id: number, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const member = await this.findOne(id);

    if (updateMemberDto.hasOwnProperty('password')) {
        throw new BadRequestException('Password updates should be done via a dedicated endpoint.');
    }

     if (updateMemberDto.username && updateMemberDto.username !== member.username) {
        const existing = await this.memberRepository.findOneBy({ username: updateMemberDto.username });
        if (existing) {
            throw new ConflictException(`Username ${updateMemberDto.username} is already taken.`);
        }
    }

    this.memberRepository.merge(member, updateMemberDto);

    try {
        return await this.memberRepository.save(member);
    } catch (error) {
         throw new BadRequestException('Could not update member.');
    }
  }

  async remove(id: number): Promise<void> {
    const member = await this.findOne(id); // Ensure exists
    const result = await this.memberRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
  }

   // Add separate method for password changes if needed
}
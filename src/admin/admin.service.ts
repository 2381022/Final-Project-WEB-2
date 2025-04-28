import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from "./admin.entity"

import * as bcrypt from 'bcrypt';
import { CreateAdminDto, UpdateAdminDto } from './dto'; // Barrel file DTOs

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const existingAdmin = await this.adminRepository.findOne({
      where: { username: createAdminDto.username },
    });

    if (existingAdmin) {
      throw new ConflictException('Username already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createAdminDto.password, saltRounds);

    const newAdmin = this.adminRepository.create({
      username: createAdminDto.username,
      password: hashedPassword,
    });

    try {
      const savedAdmin = await this.adminRepository.save(newAdmin);
      return savedAdmin;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw new BadRequestException('Could not create admin.');
    }
  }

  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find();
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    return admin;
  }

  async findByUsername(username: string): Promise<Admin | null> {
    const admin = await this.adminRepository
      .createQueryBuilder('admin')
      .select(['admin.id', 'admin.username', 'admin.password'])
      .where('admin.username = :username', { username })
      .getOne();

    return admin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.findOne(id);

    if (updateAdminDto.hasOwnProperty('password')) {
      throw new BadRequestException('Password updates should be done via a dedicated password change endpoint.');
    }

    if (updateAdminDto.username && updateAdminDto.username !== admin.username) {
      const existing = await this.adminRepository.findOne({
        where: { username: updateAdminDto.username },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(`Username ${updateAdminDto.username} is already taken.`);
      }
    }

    this.adminRepository.merge(admin, updateAdminDto);

    try {
      const updatedAdmin = await this.adminRepository.save(admin);
      return updatedAdmin;
    } catch (error) {
      console.error('Error updating admin:', error);
      throw new BadRequestException('Could not update admin.');
    }
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);

    const result = await this.adminRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Admin with ID ${id} not found during delete operation.`);
    }
  }

  // Optional future method for password change
  // async changePassword(...) { ... }
}

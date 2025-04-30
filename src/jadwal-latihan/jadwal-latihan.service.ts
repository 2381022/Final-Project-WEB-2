  import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { JadwalLatihan } from './JadwalLatihan.entity';
  import { CreateJadwalLatihanDto, UpdateJadwalLatihanDto } from './dto';
  import { Admin } from "../admin/admin.entity"; // Import Admin entity

  @Injectable()
  export class JadwalLatihanService {
    constructor(
      @InjectRepository(JadwalLatihan)
      private readonly jadwalLatihanRepository: Repository<JadwalLatihan>,
      @InjectRepository(Admin) // Inject Admin repository to find the related admin
      private readonly adminRepository: Repository<Admin>,
    ) {}
    
    async findAll(filter?: { adminId?: number }): Promise<JadwalLatihan[]> {
      // Create a 'where' clause based on filter parameters
      const whereClause: any = {};
    
      // If an adminId filter is provided, add it to the 'where' clause
      if (filter?.adminId) {
        whereClause.admin = { id: filter.adminId }; // Relate by admin id
      }
    
      try {
        return await this.jadwalLatihanRepository.find({
          where: whereClause,
          relations: ['admin'], // Optionally load related 'admin' for each schedule
          order: { id: 'ASC' },  // Order by ID or other field as needed
        });
      } catch (error) {
        throw new BadRequestException('Could not retrieve training schedules.');
      }
    }

    async create(createDto: CreateJadwalLatihanDto): Promise<JadwalLatihan> {
      // Find the admin who is creating this schedule
      const admin = await this.adminRepository.findOneBy({ id: createDto.adminId });
      if (!admin) {
        throw new NotFoundException(`Admin with ID ${createDto.adminId} not found`);
      }
    
      // Create new schedule instance without directly assigning the admin entity
      const newJadwal = this.jadwalLatihanRepository.create({
        ...createDto,
        // Do not assign admin here; we'll set it explicitly below
      });
    
      try {
        return await this.jadwalLatihanRepository.save(newJadwal);
      } catch (error) {
        throw new BadRequestException('Could not create training schedule.');
      }
    }

    async findOne(id: number): Promise<JadwalLatihan> {
      const jadwal = await this.jadwalLatihanRepository.findOne({
        where: { id },
        relations: ['admin'], // Load relation
      });
      if (!jadwal) {
        throw new NotFoundException(`Training schedule with ID ${id} not found`);
      }
      return jadwal;
    }

    async update(id: number, updateDto: UpdateJadwalLatihanDto): Promise<JadwalLatihan> {
      const jadwal : JadwalLatihan = await this.findOne(id); // Handles not found and loads relation

      let admin: Admin  = jadwal.admin; // Keep current admin by default

      // If adminId is provided in the DTO and it's different, find the new admin
      if (updateDto.adminId && updateDto.adminId !== admin.id) {
        const tmp = await this.adminRepository.findOneBy({ id: updateDto.adminId });
        if(tmp){
          admin = tmp;
        }

        if (!admin) {
          throw new NotFoundException(`Admin with ID ${updateDto.adminId} not found for update`);
        }
      }

      // Merge changes from DTO into the existing entity
      // Exclude adminId from direct merge, handle association separately
      const { adminId, ...updateData } = updateDto;
      this.jadwalLatihanRepository.merge(jadwal, updateData);
      jadwal.admin = admin; // Update admin association if changed

      try {
        return await this.jadwalLatihanRepository.save(jadwal);
      } catch (error) {
          // Log error
          throw new BadRequestException('Could not update training schedule.');
      }
    }

    async remove(id: number): Promise<void> {
      const jadwal = await this.findOne(id); // Ensure it exists
      const result = await this.jadwalLatihanRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Training schedule with ID ${id} not found`);
      }
    }
  }
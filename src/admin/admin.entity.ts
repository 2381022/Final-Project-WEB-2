import { JadwalLatihan } from 'src/jadwal-latihan/JadwalLatihan.entity';
import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity('admin')
  export class Admin {
    @PrimaryGeneratedColumn({ name: 'id_admin' })
    id: number;
  
    @Column({
      type: 'varchar',
      length: 100,
      unique: true,
      nullable: false,
    })
    username: string;
  
    @Column({
      type: 'text',
      nullable: false,
      select: false,
    })
    password: string;

    @OneToMany(() => JadwalLatihan, (jadwalLatihan) => jadwalLatihan.admin)
    jadwalLatihans: JadwalLatihan[];


  }
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  
  import { Admin } from "../admin/admin.entity";
  
  
  @Entity('jadwal_latihan')
  export class JadwalLatihan {
    @PrimaryGeneratedColumn({ name: 'id_jadwal' })
    id: number;
  
    @Column({ type: 'date', nullable: false })
    tanggal: Date; // Or string if you prefer to handle dates as strings
  
    @Column({ type: 'time', nullable: false })
    jam: string; // SQL TIME is typically mapped to string
  
    @Column({ type: 'varchar', length: 255, nullable: false })
    tempat: string;

    @ManyToOne(() => Admin, { eager: true }) // Define relation with Admin
    @JoinColumn({ name: 'id_admin' }) // Changed from admin_id to id_admin
    admin: Admin;

    
  }
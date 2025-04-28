import { Member } from 'src/member/member.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  
  
  @Entity('absensi')
  export class Absensi {
    @PrimaryGeneratedColumn({ name: 'id_absensi' })
    id: number;
  
    @CreateDateColumn({
      name: 'tanggal',      // Matches DB column name
      type: 'timestamp',    // Matches DB data type
      nullable: false,      // Matches NOT NULL constraint
      default: () => 'CURRENT_TIMESTAMP', // Matches DB DEFAULT
    })
    tanggal: Date;
  
    @Column({
      type: 'varchar',
      length: 50,
      nullable: false,
    })
    status: string; // e.g., 'Hadir', 'Izin', 'Sakit', 'Alpa'
  
    // Foreign Key Column is managed by the relationship below
  
    // Relationship: Many Absensi records belong to one Member
    @ManyToOne(() => Member, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_member' }) // Specifies the FK column in the 'absensi' table
    member: Member; // Holds the related Member object
  }
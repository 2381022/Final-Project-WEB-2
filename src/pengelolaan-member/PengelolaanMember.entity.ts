import {
    Column,
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryColumn,
  } from 'typeorm';
  import { JadwalLatihan } from '../jadwal-latihan/JadwalLatihan.entity'; // Adjust path
import { Member } from 'src/member/member.entity';
import { Admin } from 'src/admin/admin.entity';
 
  
  @Entity('pengelolaan_member')
  export class PengelolaanMember {
    // --- Composite Primary Keys ---
    // Note: These also act as Foreign Keys, defined via @ManyToOne below
  
    @PrimaryColumn({ name: 'id_jadwal', type: 'int' })
    jadwalId: number;
  
    @PrimaryColumn({ name: 'id_member', type: 'int' })
    memberId: number;
  
    // --- Other Columns ---
  
    @Column({ type: 'varchar', length: 50, nullable: false })
    status: string;
  
    // We need the id_admin column explicitly for the foreign key relationship
    // @Column({ name: 'id_admin', type: 'int', nullable: false }) // Managed by the relationship below
    // adminId: number;
  
  
    // --- Relationships ---
  
    @ManyToOne(() => JadwalLatihan, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_jadwal' }) // FK column in this table
    jadwal: JadwalLatihan;
  
    @ManyToOne(() => Member, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_member' }) // FK column in this table
    member: Member;
  
    @ManyToOne(() => Admin, { nullable: false, onDelete: 'RESTRICT' }) // NOT NULL constraint requires nullable: false
    @JoinColumn({ name: 'id_admin' }) // FK column in this table
    admin: Admin; // Admin who performed the management action
  }
import { Admin } from 'src/admin/admin.entity';
import { Member } from 'src/member/member.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';


  
  // Optional: Define an enum for the roles for better type safety
  export enum UserRole {
    ADMIN = 'admin',
    MEMBER = 'member',
  }
  
  @Entity('perubahan_password')
  export class PerubahanPassword {
    @PrimaryGeneratedColumn({ name: 'id_perubahan' })
    id: number;
  
    // Using CreateDateColumn as it matches the DB default and NOT NULL
    @CreateDateColumn({
      name: 'tanggal',
      type: 'timestamp',
      nullable: false,
      default: () => 'CURRENT_TIMESTAMP', // Explicitly match DB default
    })
    tanggal: Date;
  
    @Column({
      name: 'role_user', // Map to the database column name
      type: 'varchar',
      length: 10,
      nullable: false,
      enum: UserRole, // Use enum if defined, otherwise remove this line
    })
    roleUser: UserRole; // Or string if not using enum
  
    // --- Foreign Keys & Relationships ---
    // Note: The database CHECK constraint enforces that only one of these is non-null
    // and matches roleUser. Application logic should ensure this before saving.
  
    @ManyToOne(() => Admin, { nullable: true, onDelete: 'SET NULL' }) // FK can be NULL
    @JoinColumn({ name: 'id_admin' }) // Specifies the FK column in this table
    admin?: Admin; // Optional property, as the relationship might not exist
  
    @ManyToOne(() => Member, { nullable: true, onDelete: 'SET NULL' }) // FK can be NULL
    @JoinColumn({ name: 'id_member' }) // Specifies the FK column in this table
    member?: Member; // Optional property
  }
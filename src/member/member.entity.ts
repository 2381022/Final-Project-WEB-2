import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity('member')
  export class Member {
    @PrimaryGeneratedColumn({ name: 'id_member' })
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
  
  }
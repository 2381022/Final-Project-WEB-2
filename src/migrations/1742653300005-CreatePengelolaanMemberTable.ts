import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePengelolaanMemberTable1742653300005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Depends on 'jadwal_latihan', 'admin', 'member' tables
    await queryRunner.query(`
        CREATE TABLE pengelolaan_member (
            id_jadwal INT NOT NULL,
            id_admin INT NOT NULL, -- Admin who managed this entry?
            id_member INT NOT NULL,
            status VARCHAR(50) NOT NULL, -- e.g., 'Registered', 'Attended', 'Cancelled'
            PRIMARY KEY (id_jadwal, id_member), -- Composite Primary Key
            CONSTRAINT fk_pengelolaan_jadwal
                FOREIGN KEY (id_jadwal)
                REFERENCES jadwal_latihan(id_jadwal)
                ON DELETE CASCADE, -- If schedule deleted, remove assignments
            CONSTRAINT fk_pengelolaan_admin
                FOREIGN KEY (id_admin)
                REFERENCES admin(id_admin)
                ON DELETE RESTRICT, -- Don't delete admin if they are managing assignments? Or SET NULL? Choose RESTRICT as per original
            CONSTRAINT fk_pengelolaan_member
                FOREIGN KEY (id_member)
                REFERENCES member(id_member)
                ON DELETE CASCADE -- If member deleted, remove their assignments
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS pengelolaan_member;`);
  }
}
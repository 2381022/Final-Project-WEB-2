import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAbsensiTable1742653300004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Depends on 'member' table
    await queryRunner.query(`
        CREATE TABLE absensi (
            id_absensi SERIAL PRIMARY KEY,
            id_member INT NOT NULL,
            tanggal TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(50) NOT NULL, -- e.g., 'Hadir', 'Izin', 'Sakit', 'Alpa'
            CONSTRAINT fk_absensi_member
                FOREIGN KEY (id_member)
                REFERENCES member(id_member)
                ON DELETE CASCADE -- If member is deleted, remove their attendance records
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS absensi;`);
  }
}
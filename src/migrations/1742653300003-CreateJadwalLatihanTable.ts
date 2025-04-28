import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateJadwalLatihanTable1742653300003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Depends on 'admin' table
    await queryRunner.query(`
        CREATE TABLE jadwal_latihan (
            id_jadwal SERIAL PRIMARY KEY,
            id_admin INT NOT NULL,
            tanggal DATE NOT NULL,
            jam TIME NOT NULL,
            tempat VARCHAR(255) NOT NULL,
            CONSTRAINT fk_jadwal_admin
                FOREIGN KEY (id_admin)
                REFERENCES admin(id_admin)
                ON DELETE CASCADE -- If admin is deleted, delete their schedules
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No need to explicitly drop FK if dropping the table
    await queryRunner.query(`DROP TABLE IF EXISTS jadwal_latihan;`);
  }
}
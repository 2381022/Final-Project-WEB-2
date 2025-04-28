import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePerubahanPasswordTable1742653300006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Depends on 'admin', 'member' tables
    await queryRunner.query(`
        CREATE TABLE perubahan_password (
            id_perubahan SERIAL PRIMARY KEY,
            id_admin INT NULL, -- Nullable, change is for admin OR member
            id_member INT NULL, -- Nullable
            role_user VARCHAR(10) NOT NULL CHECK (role_user IN ('admin', 'member')), -- Explicit role
            tanggal TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_perubahan_admin
                FOREIGN KEY (id_admin)
                REFERENCES admin(id_admin)
                ON DELETE SET NULL, -- Keep log entry, but set user to null if deleted
            CONSTRAINT fk_perubahan_member
                FOREIGN KEY (id_member)
                REFERENCES member(id_member)
                ON DELETE SET NULL, -- Keep log entry, but set user to null if deleted
            -- Ensure exactly one FK is set and matches the role
            CONSTRAINT chk_user_exclusive_role CHECK (
                 (id_admin IS NOT NULL AND id_member IS NULL AND role_user = 'admin')
              OR (id_member IS NOT NULL AND id_admin IS NULL AND role_user = 'member')
            )
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS perubahan_password;`);
  }
}
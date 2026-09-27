import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminRole1759000000000 implements MigrationInterface {
  name = 'AddAdminRole1759000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'ADMIN'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // PostgreSQL não remove valores de enum: recria o tipo sem ADMIN
    await queryRunner.query(
      `UPDATE "users" SET "role" = 'MANAGER' WHERE "role" = 'ADMIN'`,
    );
    await queryRunner.query(`ALTER TYPE "user_role" RENAME TO "user_role_old"`);
    await queryRunner.query(
      `CREATE TYPE "user_role" AS ENUM ('EMPLOYEE', 'MANAGER')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" TYPE "user_role" USING "role"::text::"user_role"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'EMPLOYEE'`,
    );
    await queryRunner.query(`DROP TYPE "user_role_old"`);
  }
}

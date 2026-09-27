import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1758990000000 implements MigrationInterface {
  name = 'InitialSchema1758990000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "user_role" AS ENUM ('EMPLOYEE', 'MANAGER')`,
    );
    await queryRunner.query(
      `CREATE TYPE "vacation_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED')`,
    );
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(120) NOT NULL,
        "email" varchar(180) NOT NULL UNIQUE,
        "password_hash" varchar NOT NULL,
        "role" "user_role" NOT NULL DEFAULT 'EMPLOYEE',
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "vacation_requests" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "start_date" date NOT NULL,
        "end_date" date NOT NULL,
        "status" "vacation_status" NOT NULL DEFAULT 'PENDING',
        "decided_by" uuid NULL REFERENCES "users"("id") ON DELETE SET NULL,
        "decided_at" timestamptz NULL,
        "rejection_reason" varchar(500) NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "chk_vacation_requests_period" CHECK ("end_date" >= "start_date")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "idx_vacation_requests_status_period" ON "vacation_requests" ("status", "start_date", "end_date")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_vacation_requests_user" ON "vacation_requests" ("user_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "vacation_requests"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "vacation_status"`);
    await queryRunner.query(`DROP TYPE "user_role"`);
  }
}

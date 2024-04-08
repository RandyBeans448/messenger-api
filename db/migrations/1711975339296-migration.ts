import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1711975339296 implements MigrationInterface {
  name = 'Migration1711975339296';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "friends" ADD "accepted" boolean NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "friends" DROP COLUMN "accepted"`);
  }
}

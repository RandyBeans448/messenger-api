import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1711975253677 implements MigrationInterface {
  name = 'Migration1711975253677';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "friends" ADD "pending" boolean NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "friends" DROP COLUMN "pending"`);
  }
}

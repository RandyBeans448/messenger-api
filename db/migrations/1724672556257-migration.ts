import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724672556257 implements MigrationInterface {
    name = 'Migration1724672556257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" ADD "message" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "message"`);
    }

}

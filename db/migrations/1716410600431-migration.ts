import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1716410600431 implements MigrationInterface {
    name = 'Migration1716410600431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friend_request" ADD "receiverId" uuid`);
        await queryRunner.query(`ALTER TABLE "friend_request" ADD CONSTRAINT "UQ_470e723fdad9d6f4981ab2481eb" UNIQUE ("receiverId")`);
        await queryRunner.query(`ALTER TABLE "friend_request" ADD CONSTRAINT "FK_470e723fdad9d6f4981ab2481eb" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friend_request" DROP CONSTRAINT "FK_470e723fdad9d6f4981ab2481eb"`);
        await queryRunner.query(`ALTER TABLE "friend_request" DROP CONSTRAINT "UQ_470e723fdad9d6f4981ab2481eb"`);
        await queryRunner.query(`ALTER TABLE "friend_request" DROP COLUMN "receiverId"`);
    }

}

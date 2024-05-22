import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1716322568291 implements MigrationInterface {
    name = 'Migration1716322568291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friend_request" ADD "requestSentById" uuid`);
        await queryRunner.query(`ALTER TABLE "friend_request" ADD CONSTRAINT "FK_077bd51b294050a05fd21701c89" FOREIGN KEY ("requestSentById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friend_request" DROP CONSTRAINT "FK_077bd51b294050a05fd21701c89"`);
        await queryRunner.query(`ALTER TABLE "friend_request" DROP COLUMN "requestSentById"`);
    }

}

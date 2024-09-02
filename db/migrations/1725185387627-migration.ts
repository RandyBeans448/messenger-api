import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1725185387627 implements MigrationInterface {
    name = 'Migration1725185387627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_867f9b37dcc79035fa20e8ffe5e"`);
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "REL_867f9b37dcc79035fa20e8ffe5"`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_867f9b37dcc79035fa20e8ffe5e" FOREIGN KEY ("friendId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_867f9b37dcc79035fa20e8ffe5e"`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "REL_867f9b37dcc79035fa20e8ffe5" UNIQUE ("friendId")`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_867f9b37dcc79035fa20e8ffe5e" FOREIGN KEY ("friendId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

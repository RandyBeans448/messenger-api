import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1722893348801 implements MigrationInterface {
    name = 'Migration1722893348801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_9009da5fcb6b837c79f4ef065a4"`);
        await queryRunner.query(`ALTER TABLE "friends" ALTER COLUMN "conversationsId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_9009da5fcb6b837c79f4ef065a4" FOREIGN KEY ("conversationsId") REFERENCES "conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_9009da5fcb6b837c79f4ef065a4"`);
        await queryRunner.query(`ALTER TABLE "friends" ALTER COLUMN "conversationsId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_9009da5fcb6b837c79f4ef065a4" FOREIGN KEY ("conversationsId") REFERENCES "conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

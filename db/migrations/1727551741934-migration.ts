import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1727551741934 implements MigrationInterface {
    name = 'Migration1727551741934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "crypto_keys" ("id" SERIAL NOT NULL, "sharedSecret" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_191a96b2cc4537d0c99810cc9ec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "friends" ADD "cryptoKeyId" integer`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "UQ_42734d7e7ee9e4311561654e556" UNIQUE ("cryptoKeyId")`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_42734d7e7ee9e4311561654e556" FOREIGN KEY ("cryptoKeyId") REFERENCES "crypto_keys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_42734d7e7ee9e4311561654e556"`);
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "UQ_42734d7e7ee9e4311561654e556"`);
        await queryRunner.query(`ALTER TABLE "friends" DROP COLUMN "cryptoKeyId"`);
        await queryRunner.query(`DROP TABLE "crypto_keys"`);
    }

}

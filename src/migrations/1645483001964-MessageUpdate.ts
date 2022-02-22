import {MigrationInterface, QueryRunner} from "typeorm";

export class MessageUpdate1645483001964 implements MigrationInterface {
    name = 'MessageUpdate1645483001964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "talk" ALTER COLUMN "title" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_07a34d985369f205b7e8287eb1a"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "talkId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_07a34d985369f205b7e8287eb1a" FOREIGN KEY ("talkId") REFERENCES "talk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_07a34d985369f205b7e8287eb1a"`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "talkId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_07a34d985369f205b7e8287eb1a" FOREIGN KEY ("talkId") REFERENCES "talk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "talk" ALTER COLUMN "title" SET NOT NULL`);
    }

}

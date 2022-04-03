import {MigrationInterface, QueryRunner} from "typeorm";

export class TalkUsers21648999849612 implements MigrationInterface {
    name = 'TalkUsers21648999849612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_talk" DROP CONSTRAINT "FK_d903f70a074d3ead2c687c6112a"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_07a34d985369f205b7e8287eb1a"`);
        await queryRunner.query(`ALTER TABLE "user_talk" DROP CONSTRAINT "FK_ea3ddd2851c5a370fef865b7237"`);
        await queryRunner.query(`ALTER TABLE "user_talk" ALTER COLUMN "talkId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_talk" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "talk" ALTER COLUMN "title" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_talk" ADD CONSTRAINT "FK_d903f70a074d3ead2c687c6112a" FOREIGN KEY ("talkId") REFERENCES "talk"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_talk" ADD CONSTRAINT "FK_ea3ddd2851c5a370fef865b7237" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_07a34d985369f205b7e8287eb1a" FOREIGN KEY ("talkId") REFERENCES "talk"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_07a34d985369f205b7e8287eb1a"`);
        await queryRunner.query(`ALTER TABLE "user_talk" DROP CONSTRAINT "FK_ea3ddd2851c5a370fef865b7237"`);
        await queryRunner.query(`ALTER TABLE "user_talk" DROP CONSTRAINT "FK_d903f70a074d3ead2c687c6112a"`);
        await queryRunner.query(`ALTER TABLE "talk" ALTER COLUMN "title" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_talk" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_talk" ALTER COLUMN "talkId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_talk" ADD CONSTRAINT "FK_ea3ddd2851c5a370fef865b7237" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_07a34d985369f205b7e8287eb1a" FOREIGN KEY ("talkId") REFERENCES "talk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_talk" ADD CONSTRAINT "FK_d903f70a074d3ead2c687c6112a" FOREIGN KEY ("talkId") REFERENCES "talk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

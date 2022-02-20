import {MigrationInterface, QueryRunner} from "typeorm";

export class UserTalk1645221110818 implements MigrationInterface {
    name = 'UserTalk1645221110818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_talk_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "user_talk" ("id" SERIAL NOT NULL, "status" "public"."user_talk_status_enum" NOT NULL DEFAULT '0', "talkId" integer, "userId" integer, CONSTRAINT "PK_0dfc5b6785d0a831149d86889fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_talk" ADD CONSTRAINT "FK_d903f70a074d3ead2c687c6112a" FOREIGN KEY ("talkId") REFERENCES "talk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_talk" ADD CONSTRAINT "FK_ea3ddd2851c5a370fef865b7237" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_talk" DROP CONSTRAINT "FK_ea3ddd2851c5a370fef865b7237"`);
        await queryRunner.query(`ALTER TABLE "user_talk" DROP CONSTRAINT "FK_d903f70a074d3ead2c687c6112a"`);
        await queryRunner.query(`DROP TABLE "user_talk"`);
        await queryRunner.query(`DROP TYPE "public"."user_talk_status_enum"`);
    }

}

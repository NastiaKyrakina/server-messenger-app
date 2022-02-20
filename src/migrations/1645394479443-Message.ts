import {MigrationInterface, QueryRunner} from "typeorm";

export class Message1645394479443 implements MigrationInterface {
    name = 'Message1645394479443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "sendDateTime" TIMESTAMP NOT NULL DEFAULT now(), "talkId" integer, "userId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."message_attachment_type_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "message_attachment" ("id" SERIAL NOT NULL, "path" character varying NOT NULL, "type" "public"."message_attachment_type_enum" NOT NULL DEFAULT '3', "messageId" integer, CONSTRAINT "PK_d5bc54379802d99c07cd7ec00e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "talk" ALTER COLUMN "title" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_07a34d985369f205b7e8287eb1a" FOREIGN KEY ("talkId") REFERENCES "talk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message_attachment" ADD CONSTRAINT "FK_2ac7499c95ef4f2b7cf2f0f26ef" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message_attachment" DROP CONSTRAINT "FK_2ac7499c95ef4f2b7cf2f0f26ef"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_07a34d985369f205b7e8287eb1a"`);
        await queryRunner.query(`ALTER TABLE "talk" ALTER COLUMN "title" DROP NOT NULL`);
        await queryRunner.query(`DROP TABLE "message_attachment"`);
        await queryRunner.query(`DROP TYPE "public"."message_attachment_type_enum"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}

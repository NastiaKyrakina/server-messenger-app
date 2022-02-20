import {MigrationInterface, QueryRunner} from "typeorm";

export class Talk1645219235809 implements MigrationInterface {
    name = 'Talk1645219235809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."talk_type_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "talk" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "type" "public"."talk_type_enum" NOT NULL DEFAULT '1', "creationDateTime" TIMESTAMP NOT NULL DEFAULT now(), "imagePath" character varying, CONSTRAINT "PK_645e0089c9f92048125eef3d8eb" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "talk"`);
        await queryRunner.query(`DROP TYPE "public"."talk_type_enum"`);
    }

}

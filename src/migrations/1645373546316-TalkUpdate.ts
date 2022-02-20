import {MigrationInterface, QueryRunner} from "typeorm";

export class TalkUpdate1645373546316 implements MigrationInterface {
    name = 'TalkUpdate1645373546316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "talk" ALTER COLUMN "title" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "talk" ALTER COLUMN "title" DROP NOT NULL`);
    }

}

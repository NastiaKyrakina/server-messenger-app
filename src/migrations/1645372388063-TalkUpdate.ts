import {MigrationInterface, QueryRunner} from "typeorm";

export class TalkUpdate1645372388063 implements MigrationInterface {
    name = 'TalkUpdate1645372388063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "talk" ALTER COLUMN "title" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "talk" ALTER COLUMN "title" SET NOT NULL`);
    }

}

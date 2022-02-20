import {MigrationInterface, QueryRunner} from "typeorm";

export class TalkUpdateProcces1645374147631 implements MigrationInterface {
    name = 'TalkUpdateProcces1645374147631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "talk" ALTER COLUMN "title" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "talk" ALTER COLUMN "title" SET NOT NULL`);
    }

}

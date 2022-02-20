import {MigrationInterface, QueryRunner} from "typeorm";

export class UsersTableChange1644841801677 implements MigrationInterface {
    name = 'UsersTableChange1644841801677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "lastLoginDateTime" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "lastLoginDateTime" SET NOT NULL`);
    }

}

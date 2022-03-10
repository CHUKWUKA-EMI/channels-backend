import {MigrationInterface, QueryRunner} from "typeorm";

export class modified_usersTable1643547173251 implements MigrationInterface {
    name = 'modified_usersTable1643547173251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "userRole" character varying NOT NULL DEFAULT 'USER'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userRole"`);
    }

}

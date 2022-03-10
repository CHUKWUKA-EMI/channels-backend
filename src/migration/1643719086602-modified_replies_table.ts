import {MigrationInterface, QueryRunner} from "typeorm";

export class modifiedRepliesTable1643719086602 implements MigrationInterface {
    name = 'modifiedRepliesTable1643719086602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "replies" ADD "commentId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "replies" DROP COLUMN "commentId"`);
    }

}

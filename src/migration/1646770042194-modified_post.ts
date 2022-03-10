import {MigrationInterface, QueryRunner} from "typeorm";

export class modifiedPost1646770042194 implements MigrationInterface {
    name = 'modifiedPost1646770042194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "search_document_with_weights" tsvector NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "userName" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userName"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "search_document_with_weights"`);
    }

}

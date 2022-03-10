import { MigrationInterface, QueryRunner } from 'typeorm';

export class modifiedUserEntity1646771886041 implements MigrationInterface {
  name = 'modifiedUserEntity1646771886041';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "userName" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "userName" DROP NOT NULL`,
    );
  }
}

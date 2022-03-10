import { MigrationInterface, QueryRunner } from 'typeorm';

export class fullTextSearch1645040628714 implements MigrationInterface {
  name = 'fullTextSearch1645040628714';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    update posts set search_document_with_weights = setweight(to_tsvector(coalesce(title,'')), 'A') ||
  setweight(to_tsvector(coalesce(content,'')), 'B');
CREATE INDEX search_document_weights_idx
  ON posts
  USING GIN (search_document_with_weights);
        CREATE FUNCTION posts_tsvector_trigger() RETURNS trigger AS $$
begin
  new.search_document_with_weights := 
     setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
     setweight(to_tsvector('english', coalesce(new.content, '')), 'B');
  return new;
end
$$ LANGUAGE plpgsql;
CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
    ON posts FOR EACH ROW EXECUTE PROCEDURE posts_tsvector_trigger();
        `);
  }

  public async down(): Promise<void> {}
}

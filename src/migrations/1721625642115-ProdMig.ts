import { MigrationInterface, QueryRunner } from "typeorm";

export class ProdMig1721625642115 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "review" (
              "id" character varying NOT NULL,
              "title" character varying NOT NULL,
              "description" text,
              "rating" integer NOT NULL,
              "product_id" character varying NOT NULL,
              "user_id" character varying NOT NULL,
              "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
              "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
              CONSTRAINT "review_rating_check" CHECK (rating >= 1 AND rating <= 5),
              CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id")
            )
          `);
      
          await queryRunner.query(`
            CREATE INDEX "IDX_review_product_id" ON "review" ("product_id")
          `);
      
          await queryRunner.query(`
            ALTER TABLE "product" ADD COLUMN "average_rating" decimal(3,2)
          `);
      
          await queryRunner.query(`
            ALTER TABLE "review" ADD CONSTRAINT "FK_review_product" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
          `);
      
          await queryRunner.query(`
            ALTER TABLE "review" ADD CONSTRAINT "FK_review_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_review_user"`);
    await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_review_product"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "average_rating"`);
    await queryRunner.query(`DROP INDEX "IDX_review_product_id"`);
    await queryRunner.query(`DROP TABLE "review"`);
  }
    }


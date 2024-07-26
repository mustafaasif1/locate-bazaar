import { MigrationInterface, QueryRunner } from "typeorm";

export class Prodmig1721991995211 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE review (
                id character varying NOT NULL,
                title character varying NOT NULL,
                description text,
                rating integer NOT NULL,
                product_id character varying NOT NULL,
                user_id character varying NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_review_product_id" ON "review" ("product_id")
        `);

        // Add average_rating column to the product table
        await queryRunner.query(`
            ALTER TABLE product ADD "average_rating" decimal(3,1) NOT NULL DEFAULT '0'
        `);

        // Add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE review ADD CONSTRAINT "FK_2a11d3c0ea1e6dd5e722f3bc7c5" 
            FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE review ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" 
            FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"
        `);

        await queryRunner.query(`
            ALTER TABLE "review" DROP CONSTRAINT "FK_2a11d3c0ea1e6dd5e722f3bc7c5"
        `);

        await queryRunner.query(`
            DROP INDEX "IDX_review_product_id"
        `);

        await queryRunner.query(`
            ALTER TABLE "product" DROP COLUMN "average_rating"
        `);

        
        await queryRunner.query(`
            DROP TABLE "review"
        `);
    }

}

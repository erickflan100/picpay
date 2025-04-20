import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';

export class CriarUsuarios1745106545884 implements MigrationInterface {
    name = 'CriarUsuarios1745106545884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const senha = 'admin123';
        const salt = await bcrypt.genSalt(12);
        const senhaHash = await bcrypt.hash(senha, salt);

        await queryRunner.query(`CREATE TABLE "wallet" ("id" SERIAL NOT NULL, "balance" numeric(10,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "fullName" character varying NOT NULL, "cpfCnpj" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'common', "walletId" integer, CONSTRAINT "UQ_7af4c672f664c1be8fbadae9ade" UNIQUE ("cpfCnpj"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_922e8c1d396025973ec81e2a40" UNIQUE ("walletId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "value" numeric(10,2) NOT NULL, "status" character varying NOT NULL DEFAULT 'completed', "payerId" integer, "payeeId" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_922e8c1d396025973ec81e2a402" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_e32e0d2862e47419a5bb7370787" FOREIGN KEY ("payerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_70815d35b9b0fe366cc9014cb9e" FOREIGN KEY ("payeeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
        await queryRunner.query(`
            INSERT INTO "user" ("fullName", "cpfCnpj", "email", "password", "role")
            VALUES ('Admin', '12345678901', 'admin@admin.com', '${senhaHash}', 'common');
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_70815d35b9b0fe366cc9014cb9e"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_e32e0d2862e47419a5bb7370787"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_922e8c1d396025973ec81e2a402"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
    }

}

import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../entities/user.entity';
import { faker } from '@faker-js/faker';

export class Init1758861007997 implements MigrationInterface {
  name = 'Init1758861007997';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
      `);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "full_name" character varying, "phone_number" character varying, "country" character varying NOT NULL, "address_line" character varying NOT NULL, "zip_code" character varying NOT NULL, "city" character varying NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    const users = this.generateFakeUsers();
    await queryRunner.manager.save(User, users, { chunk: 100, reload: false });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }

  private generateFakeUsers(count = 5000): User[] {
    const users: User[] = [];

    for (let i = 0; i < count; i++) {
      const user = new User();

      // Ensure unique usernames by appending the index
      user.username = faker.internet.username() + i;
      user.fullName = faker.person.fullName();
      user.phoneNumber = faker.phone.number({ style: 'international' });

      // Location fields
      user.country = faker.location.country();
      user.addressLine = faker.location.streetAddress({ useFullAddress: true });
      user.zipCode = faker.location.zipCode();
      user.city = faker.location.city();

      users.push(user);
    }

    return users;
  }
}

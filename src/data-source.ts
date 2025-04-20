import { DataSource } from 'typeorm';
import { User } from './user/user.entity';
import { Wallet } from './wallet/wallet.entity';
import { Transaction } from './transaction/transaction.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'picpay',
  synchronize: false,
  logging: true,
  entities: [User, Wallet, Transaction],
  migrations: ['src/migrations/*.ts'],
});

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  cpfCnpj: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'common' })
  role: 'common' | 'merchant';

  @OneToOne(() => Wallet, { cascade: true })
  @JoinColumn()
  wallet: Wallet;
}
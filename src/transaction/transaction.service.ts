import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from '../user/user.entity';
import { Wallet } from '../wallet/wallet.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>
  ) { }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async create(transactionData: Partial<Transaction>): Promise<Transaction> {
    const { payer, payee, value } = transactionData;
  
    const payerUser = await this.userRepository.findOne({ where: { id: payer?.id ?? 0 }, relations: ['wallet'] });
    const payeeUser = await this.userRepository.findOne({ where: { id: payee?.id ?? 0 }, relations: ['wallet'] });
  
    if (!payerUser || !payeeUser) {
      throw new Error('Usuário não encontrado.');
    }
  
    if (payerUser.role === 'merchant') {
      throw new Error('Lojistas não podem realizar pagamentos.');
    }

    if (!value) {
      throw new Error('O valor da transação é inválido.');
    }
  
    if (payerUser.wallet.balance < value) {
      throw new Error('Saldo insuficiente.');
    }
  
    // Realiza a transação
    payerUser.wallet.balance -= value;
    payeeUser.wallet.balance += value;
  
    await this.walletRepository.save(payerUser.wallet);
    await this.walletRepository.save(payeeUser.wallet);
  
    const transaction = this.transactionRepository.create(transactionData);
    return this.transactionRepository.save(transaction);
  }
}

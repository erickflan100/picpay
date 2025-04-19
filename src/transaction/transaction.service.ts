import { Injectable, NotFoundException, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from '../user/user.entity';
import { Wallet } from '../wallet/wallet.entity';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) { }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async create(transactionData: { payer: number; payee: number; value: number }): Promise<Transaction> {
    this.logger.log('Criando transaction...');
    const { payer, payee, value } = transactionData;
  
    const payerUser = await this.userRepository.findOne({ where: { id: payer }, relations: ['wallet'] });
    const payeeUser = await this.userRepository.findOne({ where: { id: payee }, relations: ['wallet'] });
  
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
    payerUser.wallet.balance = Number(payerUser.wallet.balance) - value;
    payeeUser.wallet.balance = Number(payeeUser.wallet.balance) + value;
  
    await this.walletRepository.save(payerUser.wallet);
    await this.walletRepository.save(payeeUser.wallet);

    const transaction = this.transactionRepository.create({
      payer: payerUser,
      payee: payeeUser,
      value,
    });

    return this.transactionRepository.save(transaction);
  }

  async deposit(userId: number, password: string, amount: number): Promise<Wallet> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['wallet'] });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (user.password !== password) throw new UnauthorizedException('Senha incorreta');
    if (amount <= 0) throw new BadRequestException('Valor inválido');
    
    user.wallet.balance = Number(user.wallet.balance) + amount;

    return this.walletRepository.save(user.wallet);
  }

  async withdraw(userId: number, password: string, amount: number): Promise<Wallet> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['wallet'] });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (user.password !== password) throw new UnauthorizedException('Senha incorreta');
    if (amount <= 0 || amount > Number(user.wallet.balance)) throw new BadRequestException('Valor inválido para saque');
    
    user.wallet.balance = Number(user.wallet.balance) - amount;

    return this.walletRepository.save(user.wallet);
  }

  handleError(error: Error) {
    this.logger.error('Erro ao criar a transação', error.stack);
  }
}

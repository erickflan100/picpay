import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { User } from '../user/user.entity';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Wallet[]> {
    return this.walletRepository.find();
  }

  async create(): Promise<Wallet> {
    this.logger.log('Criando wallet...');
    const wallet = this.walletRepository.create();
    return this.walletRepository.save(wallet);
  }

  handleError(error: Error) {
    this.logger.error('Erro ao criar a wallet', error.stack);
  }
}
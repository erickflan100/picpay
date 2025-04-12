import { Controller, Get, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { Wallet } from '../wallet/wallet.entity';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Get()
  async findAll(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }

  @Post('deposit')
  async deposit(
    @Body() body: { userId: number; password: string; amount: number },
  ): Promise<Wallet> {
    return this.transactionService.deposit(body.userId, body.password, body.amount);
  }

  @Post('withdraw')
  async withdraw(
    @Body() body: { userId: number; password: string; amount: number },
  ): Promise<Wallet> {
    return this.transactionService.withdraw(body.userId, body.password, body.amount);
  }

  @Post()
  async create(@Body() data: { payer: number; payee: number; value: number }): Promise<Transaction> {
    return this.transactionService.create(data);
  }
}
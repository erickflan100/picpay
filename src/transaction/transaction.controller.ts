import { Controller, Get, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { Wallet } from '../wallet/wallet.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { WalletOperationDto } from './dto/wallet-operation.sto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('transaction')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @ApiOperation({ summary: 'Realiza a consulta de todas as transações' })
  @Get()
  async findAll(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }

  @ApiOperation({ summary: 'Realiza o depósito da carteira' })
  @Post('deposit')
  async deposit(
    @Body() body: WalletOperationDto,
  ): Promise<Wallet> {
    return this.transactionService.deposit(body.userId, body.password, body.amount);
  }

  @ApiOperation({ summary: 'Realiza o saque da carteira' })
  @Post('withdraw')
  async withdraw(
    @Body() body: WalletOperationDto,
  ): Promise<Wallet> {
    return this.transactionService.withdraw(body.userId, body.password, body.amount);
  }

  @ApiOperation({ summary: 'Realiza a transação da carteira' })
  @Post()
  async create(@Body() data: CreateTransactionDto): Promise<Transaction> {
    return this.transactionService.create(data);
  }
}
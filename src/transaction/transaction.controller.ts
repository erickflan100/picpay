import { Controller, Get, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { Wallet } from '../wallet/wallet.entity';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
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

  @ApiCreatedResponse({
    description: 'Lista de transações realizadas.',
    schema: {
      example: {
        message: [
          {
            "id": 1,
            "value": "1.50",
            "status": "completed"
          }
        ],
      },
    },
  })
  @ApiOperation({ summary: 'Realiza a consulta de todas as transações' })
  @Get()
  async findAll(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }

  @ApiCreatedResponse({
    description: 'Realiza o depósito da carteira.',
    schema: {
      example: {
        message: [
          {
            "id": 1,
            "balance": 100.5
          }
        ],
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Erro ao realizar o depósito.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Usuário não encontrado.',
          'Senha incorreta.',
          'Valor inválido.',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiOperation({ summary: 'Realiza o depósito da carteira' })
  @Post('deposit')
  async deposit(
    @Body() body: WalletOperationDto,
  ): Promise<Wallet> {
    return this.transactionService.deposit(body.userId, body.password, body.amount);
  }

  @ApiCreatedResponse({
    description: 'Realiza o depósito da carteira.',
    schema: {
      example: {
        message: [
          {
            "id": 1,
            "balance": 98
          }
        ],
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Erro ao realizar o saque.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Usuário não encontrado.',
          'Senha incorreta.',
          'Valor inválido para saque.',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiOperation({ summary: 'Realiza o saque da carteira' })
  @Post('withdraw')
  async withdraw(
    @Body() body: WalletOperationDto,
  ): Promise<Wallet> {
    return this.transactionService.withdraw(body.userId, body.password, body.amount);
  }

  @ApiCreatedResponse({
    description: 'Realiza a transação entre carteiras.',
    schema: {
      example: {
        message: [
          {
            message: "Transação realizada com sucesso."
          }
        ],
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Erro ao realizar uma transação.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Usuário não encontrado.',
          'Lojistas não podem realizar pagamentos.',
          'O valor da transação é inválido.',
          'Saldo insuficiente.',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiOperation({ summary: 'Realiza a transação da carteira' })
  @Post()
  async create(@Body() data: CreateTransactionDto): Promise<{ message: string }> {
    return this.transactionService.create(data);
  }
}
import { Controller, Get, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { Wallet } from './wallet.entity';

@ApiTags('wallet')
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @ApiCreatedResponse({
    description: 'Consulta as carteiras cadastradas',
    schema: {
      example: {
        message: [
          {
            "id": 1,
            "balance": "0.00"
          },
        ],
      },
    },
  })
  @ApiOperation({ summary: 'Realiza a consulta de todas as carteiras' })
  @Get()
  async findAll(): Promise<Wallet[]> {
    return this.walletService.findAll();
  }

  @ApiOperation({ summary: 'Realiza a inclusão de uma nova carteira' })
  @Post()
  async create(): Promise<Wallet> {
    return this.walletService.create();
  }
}
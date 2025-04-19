import { Controller, Get, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Wallet } from './wallet.entity';

@ApiTags('wallet')
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

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
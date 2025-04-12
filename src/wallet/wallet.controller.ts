import { Controller, Get, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Wallet } from './wallet.entity';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Get()
  async findAll(): Promise<Wallet[]> {
    return this.walletService.findAll();
  }

  @Post()
  async create(): Promise<Wallet> {
    return this.walletService.create();
  }
}
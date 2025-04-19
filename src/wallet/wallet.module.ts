import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { WalletService } from './wallet.service';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { WalletController } from './wallet.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, User]),
    UserModule
  ],
  providers: [WalletService, Logger],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule { }
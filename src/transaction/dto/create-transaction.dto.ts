import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ example: 1, description: 'Id do pagador' })
  @IsInt({ message: 'O ID do pagador deve ser um número inteiro.' })
  payer: number;

  @ApiProperty({ example: 2, description: 'Id do recebedor' })
  @IsInt({ message: 'O ID do recebedor deve ser um número inteiro.' })
  payee: number;

  @ApiProperty({ example: 10.00, description: 'Valor para transferência' })
  @IsPositive({ message: 'O valor da transação deve ser maior que zero.' })
  @Min(0.01, { message: 'O valor mínimo é R$0.01.' })
  value: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min, IsString, Length } from 'class-validator';

export class WalletOperationDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  @IsInt({ message: 'O ID do usuário deve ser um número inteiro.' })
  userId: number;

  @ApiProperty({ example: "1234h", description: 'Senha do usuário' })
  @IsString({ message: 'A senha deve ser uma string.' })
  @Length(6, 20, { message: 'A senha deve ter entre 6 e 20 caracteres.' })
  password: string;

  @ApiProperty({ example: 200.00, description: 'Valor da Operação' })
  @IsPositive({ message: 'O valor deve ser positivo.' })
  @Min(0.01, { message: 'O valor mínimo é R$0.01.' })
  amount: number;
}

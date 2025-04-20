import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: "João da Silva", description: 'Nome completo do usuário' })
  @MinLength(10, { message: 'Insira o nome completo.' })
  @IsString({ message: 'O nome do cliente deve ser uma string.' })
  fullName: string;

  @ApiProperty({ example: "12345678901", description: 'CPF/CNPJ do usuário' })
  @Matches(/^\d{11}$|^\d{14}$/, {
    message: 'O CPF deve conter 11 dígitos ou o CNPJ 14 dígitos (apenas strings).',
  })
  cpfCnpj: string;

  @ApiProperty({ example: "joao@teste.com", description: 'E-mail do usuário' })
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @ApiProperty({ example: "12345H*h", description: 'Senha do usuário' })
  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  @MaxLength(20, { message: 'A senha deve ter no máximo 20 caracteres.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula e minúscula, um número e um caracter especial.',
  })
  password: string;

  @ApiProperty({ example: "common", description: 'O usuário deve ser "common" ou "merchant"' })
  @IsIn(['common', 'merchant'], {
    message: 'O usuário deve ser "common" ou "merchant".',
  })
  role: 'common' | 'merchant';
}

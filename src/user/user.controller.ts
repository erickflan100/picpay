import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({
    description: 'Lista de usuários cadastrados',
    schema: {
      example: {
        message: [
          {
            "id": 1,
            "fullName": "Admin",
            "cpfCnpj": "12345678901",
            "email": "admin@admin.com",
            "role": "common"
          }
        ],
      },
    },
  })
  @ApiOperation({ summary: 'Realiza a consulta dos usuários cadastrados.' })
  @Get()
  async findAll(): Promise<Partial<User>[]> {
    return this.userService.findAll();
  }

  @ApiCreatedResponse({
    description: 'Usuário criado com sucesso!',
    schema: {
      example: {
        message: 'Usuário criado com sucesso!',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Erro de validação ou conflito de dados (como e-mail ou CPF/CNPJ já existente).',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'A senha deve ter no mínimo 8 caracteres.',
          'A senha deve conter pelo menos uma letra maiúscula e minúscula, um número e um caracter especial.',
          'O usuário deve ser "common" ou "merchant"',
          'E-mail já cadastrado',
          'O nome do cliente deve ser uma string.',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiOperation({ summary: 'Realiza a inclusão de um novo usuário' })
  @Post()
  async create(@Body() userData: CreateUserDto): Promise<{ message: string }> {
  return this.userService.create(userData);
}
}
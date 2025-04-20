import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('deve retornar mensagem de sucesso ao criar o usuário', async () => {
    const dto: CreateUserDto = {
      fullName: 'teste teste',
      email: 'teste@teste.com',
      cpfCnpj: '12345678901',
      password: 'senha123',
      role: 'common',
    };

    mockUserService.create.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.create(dto);

    expect(result).toEqual({ message: 'Usuário criado com sucesso!' });
    expect(mockUserService.create).toHaveBeenCalledWith(dto);
  });
});

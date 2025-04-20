import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

const mockUserRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('deve retornar todos os usuários (sem senhas)', async () => {
    const users = [
      {
        id: 1,
        fullName: 'Admin',
        cpfCnpj: '12345678901',
        email: 'admin@admin.com',
        role: 'common',
        password: 'hash',
      },
    ];

    mockUserRepository.find.mockResolvedValue(users);

    const result = await service.findAll();

    expect(result).toEqual([
      {
        id: 1,
        fullName: 'Admin',
        cpfCnpj: '12345678901',
        email: 'admin@admin.com',
        role: 'common',
      },
    ]);

    expect(result[0]).not.toHaveProperty('password');
  });

  describe('create()', () => {
    it('deve lançar erro se o email já estiver cadastrado', async () => {
      const userDto = {
        fullName: 'admin',
        email: 'admin@admin.com',
        cpfCnpj: '12345678901',
        password: 'senha123',
        role: 'common' as 'common',
      };

      mockUserRepository.findOne
        .mockResolvedValueOnce({ id: 1, email: userDto.email })
        .mockResolvedValueOnce(null);

      await expect(service.create(userDto)).rejects.toThrow('E-mail já cadastrado');
    });

    it('deve lançar erro se o CPF/CNPJ já estiver cadastrado', async () => {
      const userDto = {
        fullName: 'Eric Dev',
        email: 'novo@email.com',
        cpfCnpj: '12345678901',
        password: 'senha123',
        role: 'common' as 'common',
      };

      mockUserRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 2, cpfCnpj: userDto.cpfCnpj });

      await expect(service.create(userDto)).rejects.toThrow('CPF/CNPJ já cadastrado');
    });

    it('deve criar o usuário se os dados forem válidos', async () => {
      const userDto = {
        fullName: 'Eric Dev',
        email: 'novo@email.com',
        cpfCnpj: '12345678901',
        password: 'senha123',
        role: 'common' as 'common',
      };

      mockUserRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      mockUserRepository.create.mockReturnValue({
        ...userDto,
        password: 'senha_hash',
      });

      mockUserRepository.save.mockResolvedValue({
        id: 1,
        ...userDto,
        password: 'senha_hash',
      });

      const result = await service.create(userDto);

      expect(result).toEqual({ message: 'Usuário criado com sucesso!' });
    });
  });
});


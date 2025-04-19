import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    this.logger.log('Criando usuário...');
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const email = userData.email;
    const cpfCnpj = userData.cpfCnpj;
    const existemail = await this.userRepository.findOne({ where: { email } })
    const existcpfcnpj = await this.userRepository.findOne({ where: { cpfCnpj } })
    if (existemail) throw new BadRequestException('E-mail já cadastrado');
    if (existcpfcnpj) throw new BadRequestException('CPF/CNPJ já cadastrado');

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      wallet: {
        balance: 0,
      }
    }
    );

    return this.userRepository.save(user);
  }

  handleError(error: Error) {
    this.logger.error('Erro ao criar usuário', error.stack);
  }
}
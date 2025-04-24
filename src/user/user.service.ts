import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository, FindOptionsOrderValue } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10, order = 'DESC' } = pagination;
    const users = await this.userRepository.find({
      order: {
        id: order as FindOptionsOrderValue,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const partialUptadeUserDto = {
      name: updateUserDto.name,
      email: updateUserDto.email,
    };
    const user = await this.userRepository.preload({
      id,
      ...partialUptadeUserDto,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.delete(id);
    return { message: `User ${user.name} successfully deleted` };
  }
}

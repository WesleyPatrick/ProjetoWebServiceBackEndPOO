import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CategoryService } from 'src/category/category.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
@Injectable()
export class TransactionService {
  constructor(
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
  async create(createTransactionDto: CreateTransactionDto) {
    const { categoryId, userId, ...transactionData } = createTransactionDto;

    const category = await this.categoryService.findOne(+categoryId);
    const user = await this.userService.findOne(userId);

    const transaction = this.transactionRepository.create({
      ...transactionData,
      category,
      user,
    });

    await this.transactionRepository.save(transaction);

    return {
      message: 'Transaction created successfully',
      data: transaction,
      category: {
        id: category.id,
        name: category.name,
      },
      user: {
        id: user.id,
        name: user.name,
      },
    };
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const transactions = await this.transactionRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: transactions,
      total: transactions.length,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['category', 'user'],
      select: {
        category: {
          id: true,
          name: true,
        },
        user: {
          id: true,
          name: true,
        },
      },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.findOne(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return this.transactionRepository.update(id, updateTransactionDto);
  }

  async remove(id: number) {
    const transaction = await this.findOne(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return this.transactionRepository.delete(transaction);
  }

  async getTotalBalance() {
    const totalBalance =
      (await this.transactionRepository.sum('value', {
        type: 'income',
      })) || 0;
    const totalExpense =
      (await this.transactionRepository.sum('value', {
        type: 'expense',
      })) || 0;
    return totalBalance - totalExpense;
  }

  async getTotalBalanceByUser(userId: string) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const totalIncome =
      (await this.transactionRepository.sum('value', {
        type: 'income',
        user: { id: userId },
      })) || 0;

    const totalExpense =
      (await this.transactionRepository.sum('value', {
        type: 'expense',
        user: { id: userId },
      })) || 0;

    return {
      userId,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }
}

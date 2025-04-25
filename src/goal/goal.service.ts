import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private goalRepository: Repository<Goal>,
    private userService: UserService,
  ) {}
  async create(createGoalDto: CreateGoalDto) {
    const user = await this.userService.findOne(createGoalDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const goal = this.goalRepository.create({ ...createGoalDto, user });
    return this.goalRepository.save(goal);
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const goals = await this.goalRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: goals,
      total: goals.length,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const goal = await this.goalRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        user: {
          id: true,
          name: true,
        },
      },
    });
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }
    return goal;
  }

  async update(id: number, updateGoalDto: UpdateGoalDto) {
    const goal = await this.goalRepository.findOneBy({ id });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    const newCurrentValue =
      Number(goal.currentValue) + (updateGoalDto.currentValue ?? 0);

    if (updateGoalDto.currentValue !== undefined) {
      if (newCurrentValue > Number(goal.goalValue)) {
        throw new BadRequestException(
          'Current value cannot be greater than goal value',
        );
      }

      if (newCurrentValue === Number(goal.goalValue)) {
        updateGoalDto.completed = true;
      }
    }

    const updatedGoal = {
      ...goal,
      currentValue: newCurrentValue,
      completed: updateGoalDto.completed ?? goal.completed,
    };

    return await this.goalRepository.save(updatedGoal);
  }

  async remove(id: number) {
    const goal = await this.goalRepository.findOneBy({
      id,
    });
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }
    return await this.goalRepository.remove(goal);
  }
}

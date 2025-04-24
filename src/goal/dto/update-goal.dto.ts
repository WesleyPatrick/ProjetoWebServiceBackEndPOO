import { PartialType } from '@nestjs/mapped-types';
import { CreateGoalDto } from './create-goal.dto';
import { IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class UpdateGoalDto extends PartialType(CreateGoalDto) {
  @IsOptional()
  @IsNumber()
  currentValue?: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}

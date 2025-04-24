import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

import { IsNumber } from 'class-validator';

import { IsString } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  goalValue: number;

  @IsNumber()
  @IsOptional()
  currentValue: number;

  @IsBoolean()
  completed: boolean;

  @IsString()
  @IsNotEmpty()
  userId: string;
}

import { IsString, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  title: string;

  @IsString()
  type: 'income' | 'expense';

  @IsNumber()
  value: number;

  @IsString()
  categoryId: string;

  @IsString()
  userId: string;
}

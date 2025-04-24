import { IsOptional, IsInt, IsNumber, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  page?: number;

  @IsNumber()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  limit?: number;

  @IsString()
  @IsOptional()
  @Type(() => String)
  order?: string;
}

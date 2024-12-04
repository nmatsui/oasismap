import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsNotAllHappinessZero } from '../validation/is-not-all-happiness-zero';

class Answer {
  @IsNotEmpty()
  @IsIn([0, 1])
  happiness1: number;

  @IsNotEmpty()
  @IsIn([0, 1])
  happiness2: number;

  @IsNotEmpty()
  @IsIn([0, 1])
  happiness3: number;

  @IsNotEmpty()
  @IsIn([0, 1])
  happiness4: number;

  @IsNotEmpty()
  @IsIn([0, 1])
  happiness5: number;

  @IsNotEmpty()
  @IsIn([0, 1])
  happiness6: number;
}

export class CreateHappinessDto {
  @IsNotEmpty()
  readonly latitude: number;
  @IsNotEmpty()
  readonly longitude: number;

  @IsOptional()
  @MaxLength(30)
  readonly memo: string;

  @ValidateNested()
  @Type(() => Answer)
  @IsNotAllHappinessZero()
  readonly answers: Answer;
}

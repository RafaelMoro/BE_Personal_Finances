import { IsMongoId, IsNotEmpty, IsBoolean } from 'class-validator';
import { CreateRecordDto } from './records.dto';
import { PartialType } from '@nestjs/swagger';
import { CreateExpense } from '../entities/expenses.entity';

export class CreateExpenseDto extends CreateRecordDto {
  @IsBoolean()
  readonly isPaid: boolean;
}

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {
  @IsMongoId()
  @IsNotEmpty()
  readonly recordId: CreateExpense;

  @IsMongoId()
  readonly userId: string;
}

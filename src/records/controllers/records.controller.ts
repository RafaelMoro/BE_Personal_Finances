import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  UseGuards,
  Delete,
} from '@nestjs/common';

import { DeleteRecordDto, UpdateRecordDto } from '../dtos/records.dto';
import { CreateExpenseDto, UpdateExpenseDto } from '../dtos/expenses.dto';
import { CreateIncomeDto, UpdateIncomeDto } from '../dtos/incomes.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RecordsService } from '../services/records.service';
import { Param } from '@nestjs/common/decorators';
@UseGuards(JwtAuthGuard)
@Controller('records')
export class RecordsController {
  constructor(private recordsService: RecordsService) {}

  @Post('/expenses')
  createExpense(@Body() payload: CreateExpenseDto) {
    return this.recordsService.createOneRecord(payload);
  }

  @Post('/incomes')
  createIncome(@Body() payload: CreateIncomeDto) {
    return this.recordsService.createOneRecord(payload, true);
  }

  @Get('/incomes/:accountId')
  findIncomeByAccount(@Param('accountId') accountId: string) {
    return this.recordsService.findRecordsByAccount(accountId, true);
  }

  @Get('/expenses/:accountId')
  findExpenseByAccount(@Param('accountId') accountId: string) {
    console.log('estoy en incomes/accountid');
    return this.recordsService.findRecordsByAccount(accountId);
  }

  @Post('/expenses/multiple')
  createMultipleExpenses(@Body() payload: CreateExpenseDto[]) {
    return this.recordsService.createMultipleRecords(payload);
  }

  @Post('/incomes/multiple')
  createMultiple(@Body() payload: CreateIncomeDto[]) {
    return this.recordsService.createMultipleRecords(payload, true);
  }

  @Delete('/multiple')
  deleteMultiple(@Body() payload: DeleteRecordDto[]) {
    return this.recordsService.deleteMultipleRecords(payload);
  }

  @Put('/expenses/multiple')
  updateMultipleExpenses(@Body() payload: UpdateExpenseDto[]) {
    return this.recordsService.updateMultipleRecords(payload);
  }

  @Put('/incomes/multiple')
  updateMultipleIcomes(@Body() payload: UpdateIncomeDto[]) {
    return this.recordsService.updateMultipleRecords(payload, true);
  }

  @Put('/expenses')
  updateExpense(@Body() payload: UpdateExpenseDto) {
    return this.recordsService.updateRecord(payload);
  }

  @Put('/incomes')
  updateIncome(@Body() payload: UpdateIncomeDto) {
    return this.recordsService.updateRecord(payload, true);
  }

  @Delete()
  remove(@Body() payload: DeleteRecordDto) {
    return this.recordsService.remove(payload);
  }
}

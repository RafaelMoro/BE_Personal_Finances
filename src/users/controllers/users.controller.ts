import {
  Body,
  Req,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import {
  CreateUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  DeleteUserDto,
  ForgotPasswordBodyDto,
} from '../dtos/users.dto';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Post()
  createUser(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  @Delete()
  remove(@Body() changes: DeleteUserDto) {
    const { email } = changes;
    return this.usersService.remove(email);
  }

  @Public()
  @Post('/forgot-password')
  forgotPassword(
    @Req() request: Request,
    @Body() payload: ForgotPasswordBodyDto,
  ) {
    const { hostname } = request;
    const { email } = payload;
    const values: ForgotPasswordDto = { email, hostname };
    return this.usersService.forgotPassword(values);
  }

  @Public()
  @Post('/reset-password/:oneTimeToken')
  resetPassword(
    @Param('oneTimeToken') oneTimeToken: string,
    @Body() changes: ResetPasswordDto,
  ) {
    const { password } = changes;
    return this.usersService.resetPassword(oneTimeToken, password);
  }
}

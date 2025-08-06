import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupRequestDto } from './dto/sign-up.dto';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'typeorm';
import { QueryRunnerDecorator } from 'src/common/decorator/query-runner.decorator';

// api/v1/auth/
@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(TransactionInterceptor)
  async signup(
    @Body() signupDto: SignupRequestDto,
    @QueryRunnerDecorator() queryRunner: QueryRunner,
  ) {
    return this.authService.signup(signupDto, queryRunner);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { SampleService } from './sample.service';
import { QueryRunner } from 'typeorm';
import { QueryRunnerDecorator } from 'src/common/decorator/query-runner.decorator';
import { CreateSampleDto } from './dto/create-sample.dto';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { AccessTokenGuard } from '../auth/guard/bearer-token.guard';
import { TokenMember } from '../member/decorator/member.decorator';
import { Member } from '../member/entities/member.entity';

// api/v1/sample/
@Controller({ version: '1', path: 'sample' })
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async createSample(
    @Body() createSampleDto: CreateSampleDto,
    @QueryRunnerDecorator() queryRunner: QueryRunner,
  ) {
    return this.sampleService.createSample(createSampleDto, queryRunner);
  }

  @Get()
  async getSample() {
    return this.sampleService.getSample();
  }

  @Get('test')
  @UseGuards(AccessTokenGuard)
  test(@TokenMember() member: Member) {
    return member;
  }
}

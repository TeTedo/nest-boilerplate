import { Module } from '@nestjs/common';
import { SampleService } from './sample.service';
import { SampleController } from './sample.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sample } from './entities/sample.entity';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sample]), AuthModule, MemberModule],
  controllers: [SampleController],
  providers: [SampleService],
})
export class SampleModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MemberModule } from '../member/member.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({}), MemberModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

import { Injectable } from '@nestjs/common';
import { Member } from './entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { SignupRequestDto } from '../auth/dto/sign-up.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async getMemberById(id: number): Promise<Member | null> {
    return await this.memberRepository.findOne({
      where: { id },
    });
  }

  async createMember(signupDto: SignupRequestDto, queryRunner: QueryRunner) {
    const member = queryRunner.manager.create(Member, {
      email: signupDto.email,
    });
    return await queryRunner.manager.save(member);
  }
}

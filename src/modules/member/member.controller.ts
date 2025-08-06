import { Controller, Get, Query } from '@nestjs/common';
import { MemberService } from './member.service';

// api/v1/member/
@Controller({ version: '1', path: 'member' })
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  async getMember(@Query('id') id: number) {
    return this.memberService.getMemberById(id);
  }
}

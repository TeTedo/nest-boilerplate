import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Member } from '../entities/member.entity';
import { RequestWithMember } from 'src/modules/auth/guard/bearer-token.guard';

export const TokenMember = createParamDecorator(
  (_data: keyof Member | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithMember>();

    if (!request.member) {
      throw new InternalServerErrorException('member not found');
    }

    if (_data) {
      return request.member[_data];
    }

    return request.member;
  },
);

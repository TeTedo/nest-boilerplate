import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Member } from 'src/modules/member/entities/member.entity';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { ENV_JWT_SECRET_KEY } from 'src/common/const/env-keys.const';
import { ConfigService } from '@nestjs/config';
import { SignupRequestDto } from './dto/sign-up.dto';
import { MemberService } from '../member/member.service';
import { QueryRunner } from 'typeorm';

interface JwtPayload {
  email: string;
  sub: number;
  type: 'access' | 'refresh';
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly memberService: MemberService,
  ) {}

  async signup(signupDto: SignupRequestDto, queryRunner: QueryRunner) {
    const member = await this.memberService.createMember(
      signupDto,
      queryRunner,
    );
    return this.loginUser(member);
  }

  loginUser(user: Pick<Member, 'id' | 'email'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  signToken(
    user: Pick<Member, 'id' | 'email'>,
    isRefreshToken: boolean,
  ): string {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      expiresIn: isRefreshToken ? '7d' : '15m',
    });
  }

  extractTokenFromHeader(header: string, isBearer: boolean) {
    const [type, token] = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (type !== prefix || !token) {
      throw new UnauthorizedException('invalid token');
    }

    return token;
  }

  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      });
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('invalid token');
      }
      throw new UnauthorizedException('token verification error');
    }
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const payload = this.verifyToken(token);

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('refresh token required');
    }

    return this.signToken(
      {
        id: payload.sub,
        email: payload.email,
      },
      isRefreshToken,
    );
  }
}

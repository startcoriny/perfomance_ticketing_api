import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import _ from 'lodash';

import { UserService } from 'src/user/user.service';

// Passport
// 인증 메커니즘을 캡슐화하고, 다양한 인증 전략을 사용하여 애플리케이션을 쉽게 확장할 수 있도록 돕는 모듈 기반의 유연한 인증 프레임워크
// 추후 카카오, 구글, 네이버같은 소셜 로그인도 구현해야하기 때문에 인증 프로세스를 passport프레임워크가 해주어 인증로직시 쉬워지고 비즈니스 로직에 더 집중할수 있다.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // JWT의 추출 방법
      ignoreExpiration: false, // 만료 확인 여부
      secretOrKey: configService.get('JWT_SECRET_KEY'), // 비밀 키
    });
  }

  // Passport의 인증 전략에 따라 자동으로 호출되는 메서드
  async validate(payload: any) {
    const user = await this.userService.findByEmail(payload.userEmail);

    if (_.isNil(user)) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return user; // 리턴하면 내장 메서드에 의해 자동으로 사용자 객체가 req.user로 설정 됨.
  }
}

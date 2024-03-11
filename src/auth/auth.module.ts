import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }), // Passport의 기본 전략 : jwt, session:false -> JWT 인증은 stateless 인증 메커니즘이기 때문
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  providers: [JwtStrategy], // AuthModule 모듈 내에서 JwtStrategy를 주입하여 사용하기 위한 설정
})
export class AuthModule {}

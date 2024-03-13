import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PointModule } from 'src/point/point.module';

// JwtModule.registerAsync() 메서드를 사용하여 모듈을 설정하고 환경 변수를 기반으로 JWT 설정을 로드하면, JwtModule은 해당 설정에 따라 JwtService를 생성하고 제공
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt_secret_key'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    PointModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

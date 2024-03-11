import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './auth/auth.module';
import { Point } from './point/entities/point.entity';
import { PointModule } from './point/point.module';
import { PerformanceModule } from './performance/performance.module';
import { Performance } from './performance/entities/performance.entity';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(), //TypeORM에서 사용되는 네이밍 전략 중 하나, 데이터베이스 테이블과 컬럼의 이름을 스네이크 케이스(snake_case)로 변환하는 전략
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [User, Point, Performance],
    synchronize: configService.get('DB_SYNC'), // 데이터베이스 스키마와 애플리케이션의 엔티티 클래스 간의 동기화를 제어, 일반적으로 false로 설정하여 동기화를 방지
    logging: true, // 데이터베이스 쿼리를 로깅할지 여부를 제어, 이 옵션을 true로 설정하면 TypeORM이 실행된 쿼리를 콘솔에 로그로 출력
  }),
  inject: [ConfigService], // 여기서 먼저 주입을 해주어야 useFactory에서 주입된 ConfigService를 사용할수 있음.
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    UserModule,
    AuthModule,
    PointModule,
    PerformanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

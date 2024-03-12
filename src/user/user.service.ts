import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { Point } from '../point/entities/point.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
    private readonly jwtService: JwtService,
  ) {}

  // 회원가입
  async signUp(
    email: string,
    password: string,
    nickName: string,
    role: string,
  ) {
    const isExistUser = await this.findByEmail(email);

    if (isExistUser) {
      throw new ConflictException(
        '사용자이메일이 존재합니다. 다른이메일로 회원가입 해주세요',
      );
    }

    //어드민으로 가입하는지 확인
    let isAdmin: boolean = role === 'ADMIN' ? true : false;
    let point: number = role === 'ADMIN' ? 0 : 1000000;

    // 비밀 번호 해쉬하기
    const hashPassword = await hash(password, 10);

    // 유저 데이터베이스에 저장
    const user = await this.userRepository.save({
      email,
      password: hashPassword,
      nickName,
      isAdmin,
    });

    await this.pointRepository.save({
      userId: user.id,
      point: point,
    });

    return 'This action adds a new user';
  }

  // 로그인
  async logIn(email: string, password: string) {
    // db와 연결할 때 []와 {}의 차이
    // [] => 배열 형태로 지정된 경우, 해당 열만을 선택하고 다른 열은 무시
    // {} => 객체 형태로 지정된 경우, 해당 열을 선택하되 추가적인 옵션을 지정
    //       ex) count나 sum 등의 집계 함수를 사용하여 열의 값을 계산,  like, not, in, notIn 등의 연산자를 사용하여 열 값을 필터링
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    });

    // 유저가 있는지 확인
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }
    // 비밀번호가 일치하는지 확인
    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀 번호를 확인해주세요.');
    }

    // 토큰 발급(리프레시, 액세스)
    const access_token = this.jwtService.sign({ userEmail: user.email });
    const refresh_token = this.jwtService.sign({ userId: user.id });

    /**레디스 저장하기 , 리프레시 사용하기**/

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }

  async profile(email: string) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user') //사용자 엔티티에 대한 새로운 쿼리 빌더만듬.
        .leftJoinAndSelect('user.point', 'point') //user 테이블과 point 테이블을 왼쪽 조인하고 point테이블 선택
        .select(['user.email', 'user.nickName', 'user.isAdmin', 'point.point']) //결과로 반환할 열을 지정
        .where('user.email = :email', { email })
        .getOne(); //쿼리를 실행하고, 결과를 단일 사용자 객체로 가져옴.

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  // 이메일 찾기 함수
  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express'; // Express의 Response 타입을 가져옴
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/util/userInfo.decorator';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signUp')
  async signUp(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.passwordCheck) {
      throw new BadRequestException(
        '비밀번호가 일치하지 않습니다. 확인해주세요',
      );
    }
    await this.userService.signUp(
      createUserDto.email,
      createUserDto.password,
      createUserDto.nickName,
      createUserDto.role,
    );
  }

  @Post('logIn')
  async logIn(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.userService.logIn(
      loginDto.email,
      loginDto.password,
    );

    // httpOnly : httpOnly를 true로 설정시 JavaScript에서 쿠키에 접근할수 없다.
    //            또한 쿠키가 CSRF(사이트간 요청 위조) 공격으로부터 보호된다.
    //            클라이언트 측에서 JavaScript로 쿠키에 액세스할 필요가 없는 경우에 주로 사용

    // secure : secure를 true로 설정시 쿠키는 HTTPS 프로토콜을 통해서만 전송된다.
    //          쿠키가 안전한 방식으로만 전송되고 브라우저와 서버 간의 통신이 암호화되어야 함을 보장한다.
    //          웹 사이트에서 민감한 정보를 다룰 때 사용
    response.cookie('accessToken', token.accessToken, {
      httpOnly: true,
      secure: true,
    });
    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async profile(@UserInfo() user: User) {
    return await this.userService.profile(user.email);
  }
}

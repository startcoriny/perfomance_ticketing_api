import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class LoginDto {
  @IsEmail() // 주어진 값이 이메일 주소 형식인지 확인하는 유효성 검사 데코레이터, 유효한 이메일 주소인 경우에는 true 아니면 false
  @IsNotEmpty({ message: '이메일을 입력해주세요' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}

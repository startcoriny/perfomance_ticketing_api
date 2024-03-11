import { IsEmail, IsNotEmpty, IsString, isNotEmpty } from 'class-validator';
import { LoginDto } from './login.dto';

export class CreateUserDto extends LoginDto {
  @IsString()
  @IsNotEmpty({ message: '비밀번호확인을 입력해주세요' })
  passwordCheck: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요' })
  nickName: string;

  @IsString()
  @IsNotEmpty({ message: '회원 타입을 입력해주세요' })
  role: string;
}

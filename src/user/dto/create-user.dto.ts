import { IsEmail, IsNotEmpty, IsString, isNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 다시 입력해주세요' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호확인을 입력해주세요' })
  passwordCheck: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  nickName: string;

  @IsString()
  @IsNotEmpty({ message: '회원 타입을 입력해주세요' })
  role: string;
}

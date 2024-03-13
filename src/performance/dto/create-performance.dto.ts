import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Category } from '../types/categoryRole.type';

export class CreatePerformanceDto {
  @IsString()
  @IsNotEmpty({ message: '공연 이름을 입력해주세요.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '공연 줄거리를 입력해주세요' })
  content: string;

  @IsDateString()
  @IsNotEmpty({ message: '공연 날짜를 입력해주세요.' })
  date: Date;

  @IsString()
  @IsNotEmpty({ message: '공연 장소를 입력해주세요' })
  place: string;

  @IsNumber()
  @IsNotEmpty({ message: '공연 좌석의 수를 입력해주세요' })
  seat: number;

  @IsString()
  @IsNotEmpty({ message: '공연 이미지를 추가해주세요' })
  image: string;

  /** 얘네 작동을 안하네?? **/
  @IsNotEmpty({ message: '공연 카테고리를 입력해주세요' })
  @IsEnum(Category, { message: '유효한 공연 카테고리를 입력해주세요' })
  category: Category;
}

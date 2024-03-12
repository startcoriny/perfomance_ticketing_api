import { IsNotEmpty, IsNumber } from 'class-validator';

export class SeatDto {
  @IsNumber()
  @IsNotEmpty({ message: '좌석을 입력해주세요' })
  seatNum: number;
}

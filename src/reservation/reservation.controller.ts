import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { SeatDto } from './dto/seat.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/util/userInfo.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post(':id')
  buyTicket(
    @Param('id') id: bigint,
    @UserInfo() user: User,
    @Body() seatDto: SeatDto,
  ) {
    return this.reservationService.buyTicket(id, user.id, seatDto.seatNum);
  }

  @Get()
  findReservation(@UserInfo() user: User) {
    return this.reservationService.findReservation(user.id);
  }
}

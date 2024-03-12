import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/util/userInfo.decorator';
import { userInfo } from 'os';

@UseGuards(AuthGuard('jwt'))
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post(':id')
  buyTicket(@Param('id') id: bigint, @UserInfo() user: User) {
    return this.reservationService.buyTicket(id, user.id);
  }

  @Get()
  findReservation(@UserInfo() user: User) {
    return this.reservationService.findReservation(user.id);
  }
}

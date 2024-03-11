import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/types/userRole.type';
import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/util/userInfo.decorator';
import { Category } from './types/categoryRole.type';

// @UseGuards(CategoryGuard) : PerformanceController전체에 해당 가드(CategoryGuard)를 사용하겠다.
// CategoryGuard는 AuthGuard('jwt') 를 상속받았기 때문에 해당 컨트롤러는 로그인을 하지 않으면 사용할수 없다.
@UseGuards(RolesGuard)
@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  /** ToDo => 이미지 파일 업로드 하기 **/

  @Roles(Role.Admin)
  @Post()
  create(
    @UserInfo() user: User,
    @Body() createPerformanceDto: CreatePerformanceDto,
  ) {
    return this.performanceService.create(
      user.id,
      createPerformanceDto.name,
      createPerformanceDto.content,
      createPerformanceDto.date,
      createPerformanceDto.place,
      createPerformanceDto.seat,
      createPerformanceDto.image,
      createPerformanceDto.category,
    );
  }

  @Get()
  findAll() {
    return this.performanceService.findAll();
  }

  @Get('search')
  async search(@Query('name') name: string) {
    return await this.performanceService.search(name);
  }

  @Get(':id')
  async findOne(@Param('id') id: bigint) {
    return await this.performanceService.findOne(id);
  }
}

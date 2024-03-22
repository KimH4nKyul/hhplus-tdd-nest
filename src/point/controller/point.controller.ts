import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  ValidationPipe,
} from '@nestjs/common';
import { PointHistories, UserPoint } from '../model/point.model';
import { PointDto } from './dtos/point.dto';
import { PointService } from '../service/point.service';

@Controller('/point')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  /**
   * TODO - 특정 유저의 포인트를 조회하는 기능을 작성해주세요.
   */
  @Get(':id')
  async point(@Param('id', ParseIntPipe) id: number): Promise<UserPoint> {
    return await this.pointService.point(id);
  }

  /**
   * TODO - 특정 유저의 포인트 충전/이용 내역을 조회하는 기능을 작성해주세요.
   */
  @Get(':id/histories')
  async histories(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PointHistories> {
    return await this.pointService.histories(id);
  }

  /**
   * TODO - 특정 유저의 포인트를 충전하는 기능을 작성해주세요.
   */
  @Patch(':id/charge')
  async charge(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) pointDto: PointDto,
  ): Promise<UserPoint> {
    return await this.pointService.charge(id, pointDto);
  }

  /**
   * TODO - 특정 유저의 포인트를 사용하는 기능을 작성해주세요.
   */
  @Patch(':id/use')
  async use(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) pointDto: PointDto,
  ): Promise<UserPoint> {
    return await this.pointService.use(id, pointDto);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  ValidationPipe,
} from '@nestjs/common';
import { PointHistory, UserPoint } from './point.model';
import { PointDto } from './point.dto';
import { PointReader } from './point.reader';
import { IPointHandler } from './point.controller.spec';

@Controller('/point')
export class PointController {
  constructor(
    private readonly pointReader: PointReader,
    private readonly pointHandler: IPointHandler,
  ) {}

  /**
   * TODO - 특정 유저의 포인트를 조회하는 기능을 작성해주세요.
   */
  @Get(':id')
  async point(@Param('id') id: number): Promise<UserPoint> {
    return await this.pointReader.point(id);
  }

  /**
   * TODO - 특정 유저의 포인트 충전/이용 내역을 조회하는 기능을 작성해주세요.
   */
  @Get(':id/histories')
  async histories(@Param('id') id: number): Promise<PointHistory[]> {
    return await this.pointReader.histories(id);
  }

  /**
   * TODO - 특정 유저의 포인트를 충전하는 기능을 작성해주세요.
   */
  @Patch(':id/charge')
  async charge(
    @Param('id') id: number,
    @Body(ValidationPipe) pointDto: PointDto,
  ): Promise<UserPoint> {
    await this.pointHandler.charge(id, pointDto);
    return await this.pointReader.point(id);
  }

  /**
   * TODO - 특정 유저의 포인트를 사용하는 기능을 작성해주세요.
   */
  @Patch(':id/use')
  async use(
    @Param('id') id: number,
    @Body(ValidationPipe) pointDto: PointDto,
  ): Promise<UserPoint> {
    await this.pointHandler.use(id, pointDto);
    return this.pointReader.point(id);
  }
}

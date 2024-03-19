import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  ValidationPipe,
} from '@nestjs/common';
import { PointHistory, TransactionType, UserPoint } from './point.model';
import { PointBody as PointDto } from './point.dto';
import { UserPointTable } from '../database/userpoint.table';
import { PointHistoryTable } from '../database/pointhistory.table';

@Controller('/point')
export class PointController {
  constructor(
    private readonly userDb: UserPointTable,
    private readonly historyDb: PointHistoryTable,
  ) {}

  /**
   * TODO - 특정 유저의 포인트를 조회하는 기능을 작성해주세요.
   */
  @Get(':id')
  async point(@Param('id') id: number): Promise<UserPoint> {
    if (id < 0) throw new Error(`올바르지 않은 ID 값 입니다.`);
    const userPoint = await this.userDb.selectById(id);
    return userPoint;
  }

  /**
   * TODO - 특정 유저의 포인트 충전/이용 내역을 조회하는 기능을 작성해주세요.
   */
  @Get(':id/histories')
  async histories(@Param('id') id: number): Promise<PointHistory[]> {
    if (id < 0) throw new Error(`올바르지 않은 ID 값 입니다.`);

    const histories = await this.historyDb.selectAllByUserId(id);
    if (!histories || histories.length === 0)
      throw new Error(`조회 내역이 없습니다.`);

    return histories;
  }

  /**
   * TODO - 특정 유저의 포인트를 충전하는 기능을 작성해주세요.
   */
  @Patch(':id/charge')
  async charge(
    @Param('id') id: number,
    @Body(ValidationPipe) pointDto: PointDto,
  ): Promise<UserPoint> {
    if (id < 0) throw new Error(`올바르지 않은 ID 값 입니다.`);

    const amount = pointDto.amount;
    if (amount < 0) throw new Error(`포인트가 0보다 작습니다.`);

    const history: PointHistory = await this.historyDb.insert(
      id,
      amount,
      TransactionType.CHARGE,
      Date.now(),
    );

    let userPoint = await this.userDb.selectById(id);
    const charged = userPoint.point + amount;

    userPoint = await this.userDb.insertOrUpdate(id, charged);

    return userPoint;
  }

  /**
   * TODO - 특정 유저의 포인트를 사용하는 기능을 작성해주세요.
   */
  @Patch(':id/use')
  async use(
    @Param('id') id: number,
    @Body(ValidationPipe) pointDto: PointDto,
  ): Promise<UserPoint> {
    if (id < 0) throw new Error(`올바르지 않은 ID 값 입니다.`);

    const amount = pointDto.amount;
    if (amount < 0) throw new Error(`포인트가 0보다 작습니다.`);

    let userPoint = await this.userDb.selectById(id);
    if (userPoint.point < amount)
      throw new Error(`사용할 수 있는 포인트가 없거나 적습니다.`);

    const balance = userPoint.point - amount;
    userPoint = await this.userDb.insertOrUpdate(id, balance);

    await this.historyDb.insert(id, amount, TransactionType.USE, Date.now());

    return userPoint;
  }
}

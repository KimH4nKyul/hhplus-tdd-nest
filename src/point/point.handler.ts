import { UserPointTable } from 'src/database/userpoint.table';
import { TransactionType } from './point.model';
import { PointHistoryTable } from 'src/database/pointhistory.table';
import { PointDto } from './point.dto';
import { IPointHandler } from './point.controller.spec';

export class PointHandler implements IPointHandler {
  constructor(
    private readonly userDb: UserPointTable,
    private readonly historyDb: PointHistoryTable,
  ) {}

  async charge(id: number, pointDto: PointDto): Promise<void> {
    if (id < 0) throw new Error(`올바르지 않은 ID 값 입니다.`);

    const amount = pointDto.amount;
    if (amount < 0) throw new Error(`포인트가 0보다 작습니다.`);

    await this.historyDb.insert(id, amount, TransactionType.CHARGE, Date.now());

    let userPoint = await this.userDb.selectById(id);
    const charged = userPoint.point + amount;

    await this.userDb.insertOrUpdate(id, charged);
  }

  async use(id: number, pointDto: PointDto): Promise<void> {
    if (id < 0) throw new Error(`올바르지 않은 ID 값 입니다.`);

    const amount = pointDto.amount;
    if (amount < 0) throw new Error(`포인트가 0보다 작습니다.`);

    let userPoint = await this.userDb.selectById(id);
    if (userPoint.point < amount)
      throw new Error(`사용할 수 있는 포인트가 없거나 적습니다.`);

    const balance = userPoint.point - amount;

    await this.userDb.insertOrUpdate(id, balance);
    await this.historyDb.insert(id, amount, TransactionType.USE, Date.now());
  }
}

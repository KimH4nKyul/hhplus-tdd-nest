import { TransactionType, UserPoint } from './point.model';
import { PointDto } from './point.dto';
import { UserPointTable } from 'src/database/userpoint.table';
import { PointHistoryTable } from 'src/database/pointhistory.table';

export class PointHandler {
  constructor(
    private readonly userDb: UserPointTable,
    private readonly historyDb: PointHistoryTable,
  ) {}

  async charge(id: number, pointDto: PointDto): Promise<UserPoint> {
    this.isValid(id, pointDto.amount);

    await this.historyDb.insert(
      id,
      pointDto.amount,
      TransactionType.CHARGE,
      Date.now(),
    );

    let userPoint = await this.userDb.selectById(id);
    const charged = userPoint.point + pointDto.amount;

    userPoint = await this.userDb.insertOrUpdate(id, charged);

    return userPoint;
  }

  async use(id: number, pointDto: PointDto): Promise<UserPoint> {
    this.isValid(id, pointDto.amount);

    let userPoint = await this.userDb.selectById(id);
    if (userPoint.point < pointDto.amount)
      throw new Error(`사용할 수 있는 포인트가 없거나 적습니다.`);

    const balance = userPoint.point - pointDto.amount;

    userPoint = await this.userDb.insertOrUpdate(id, balance);
    await this.historyDb.insert(
      id,
      pointDto.amount,
      TransactionType.USE,
      Date.now(),
    );

    return userPoint;
  }

  private isValid(id: number, amount: number) {
    if (id < 0) throw new Error(`올바르지 않은 ID 값 입니다.`);
    if (amount < 0) throw new Error(`포인트가 0보다 작습니다.`);
  }
}

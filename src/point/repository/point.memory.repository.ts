import {
  UserPoint,
  PointHistories,
  TransactionType,
} from '../model/point.model';
import { PointHistoryTable } from '../../database/pointhistory.table';
import { UserPointTable } from '../../database/userpoint.table';
import { IPointRepository } from './point.repository';

export class PointMemoryRepository implements IPointRepository {
  constructor(
    private readonly userDb: UserPointTable,
    private readonly historyDb: PointHistoryTable,
  ) {}

  async point(id: number): Promise<UserPoint> {
    return await this.userDb.selectById(id);
  }

  async histories(id: number): Promise<PointHistories> {
    const histories = await this.historyDb.selectAllByUserId(id);
    if (!histories || histories.length === 0)
      throw new Error(`조회 내역이 없습니다.`);

    return histories;
  }

  async use(id: number, amount: number): Promise<UserPoint> {
    let userPoint = await this.point(id);
    if (userPoint.point < amount)
      throw new Error(`사용할 수 있는 포인트가 없거나 적습니다.`);

    const balance = userPoint.point - amount;
    userPoint = await this.userDb.insertOrUpdate(id, balance);

    await this.historyDb.insert(id, amount, TransactionType.USE, Date.now());

    return userPoint;
  }

  async charge(id: number, amount: number): Promise<UserPoint> {
    if (amount <= 0) throw new Error(`충전할 수 있는 포인트가 없습니다.`);
    let userPoint = await this.point(id);
    const charged = userPoint.point + amount;

    userPoint = await this.userDb.insertOrUpdate(id, charged);
    await this.historyDb.insert(id, amount, TransactionType.CHARGE, Date.now());

    return userPoint;
  }
}

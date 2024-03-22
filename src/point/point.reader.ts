import { UserPointTable } from 'src/database/userpoint.table';
import { PointHistory, UserPoint } from './point.model';
import { PointHistoryTable } from 'src/database/pointhistory.table';

export class PointReader {
  constructor(
    private readonly userDb: UserPointTable,
    private readonly historyDb: PointHistoryTable,
  ) {}

  async point(id: number): Promise<UserPoint> {
    this.isValid(id);
    return await this.userDb.selectById(id);
  }

  async histories(id: number): Promise<PointHistory[]> {
    this.isValid(id);
    const histories = await this.historyDb.selectAllByUserId(id);
    if (!histories || histories.length === 0)
      throw new Error(`조회 내역이 없습니다.`);

    return histories;
  }

  private isValid(id: number) {
    if (id < 0) throw new Error(`올바르지 않은 ID 값 입니다.`);
    return;
  }
}

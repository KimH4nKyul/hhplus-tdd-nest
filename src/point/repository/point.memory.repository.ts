import {
  UserPoint,
  PointHistories,
  TransactionType,
} from '../model/point.model';
import { PointHistoryTable } from '../../database/pointhistory.table';
import { UserPointTable } from '../../database/userpoint.table';
import { IPointRepository } from './point.repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Mutex, MutexInterface, withTimeout } from 'async-mutex';
import { MAX_LOCK_TIMEOUT } from '../../constants/timeout';

@Injectable()
export class PointMemoryRepository implements IPointRepository {
  constructor(
    private readonly userDb: UserPointTable,
    private readonly historyDb: PointHistoryTable,
  ) {}

  private readonly mutexes: Map<number, MutexInterface> = new Map();

  async point(id: number): Promise<UserPoint> {
    return await this.userDb.selectById(id);
  }

  async histories(id: number): Promise<PointHistories> {
    const histories = await this.historyDb.selectAllByUserId(id);
    if (!histories || histories.length === 0)
      throw new NotFoundException(`조회 내역이 없습니다.`);

    return histories;
  }

  async use(id: number, amount: number): Promise<UserPoint> {
    const mutex = this.mutexOf(id);
    const release = await mutex.acquire();

    try {
      const userPoint: UserPoint = await this.point(id);
      if (userPoint.point < amount)
        throw new BadRequestException(
          `사용할 수 있는 포인트가 없거나 적습니다.`,
        );
      const balance = userPoint.point - amount;
      return await this.userDb.insertOrUpdate(id, balance);
    } finally {
      release();
      this.historyDb.insert(id, amount, TransactionType.USE, Date.now());
    }
  }

  async charge(id: number, amount: number): Promise<UserPoint> {
    if (amount <= 0)
      throw new BadRequestException(`충전할 수 있는 포인트가 없습니다.`);

    const mutex = this.mutexOf(id);
    const release = await mutex.acquire();

    try {
      const userPoint: UserPoint = await this.point(id);
      const charged = userPoint.point + amount;
      return await this.userDb.insertOrUpdate(id, charged);
    } finally {
      release();
      await this.historyDb.insert(
        id,
        amount,
        TransactionType.CHARGE,
        Date.now(),
      );
    }
  }

  private mutexOf(id: number): MutexInterface {
    let mutex = this.mutexes.get(id);
    if (!mutex) {
      mutex = withTimeout(
        new Mutex(),
        MAX_LOCK_TIMEOUT,
        new Error(`시간 내에 뮤텍스를 얻지 못했습니다. ${id}`),
      );
      this.mutexes.set(id, mutex);
    }
    return mutex;
  }
}

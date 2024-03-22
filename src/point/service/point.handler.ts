import { UserId, UserPoint } from '../model/point.model';
import { IPointRepository } from '../repository/point.repository';
import { Mutex, MutexInterface, withTimeout } from 'async-mutex';
export class PointHandler {
  constructor(private readonly pointRepository: IPointRepository) {}

  private readonly mutexes: Map<UserId, MutexInterface> = new Map();

  async charge(id: number, amount: number): Promise<UserPoint> {
    this.isValid(id, amount);

    const mutex = this.mutexOf(id);
    mutex.acquire();
    try {
      return await this.pointRepository.charge(id, amount);
    } finally {
      mutex.release();
    }
  }

  async use(id: number, amount: number): Promise<UserPoint> {
    this.isValid(id, amount);
    const mutex = this.mutexOf(id);
    mutex.acquire();
    try {
      return await this.pointRepository.use(id, amount);
    } finally {
      mutex.release();
    }
  }

  private mutexOf(id: UserId): MutexInterface {
    let mutex = this.mutexes.get(id);
    if (!mutex) {
      mutex = withTimeout(
        new Mutex(),
        1000,
        new Error(`시간 내에 뮤텍스를 얻지 못했습니다.`),
      );
      this.mutexes.set(id, mutex);
    }
    return mutex;
  }

  private isValid(id: number, amount: number) {
    if (id < 0) throw new Error(`올바르지 않은 ID 값 입니다.`);
    if (amount < 0) throw new Error(`포인트가 0보다 작습니다.`);
  }
}

import { UserPoint } from '../model/point.model';
import { IPointRepository } from '../repository/point.repository';

export class PointHandler {
  constructor(private readonly pointRepository: IPointRepository) {}

  async charge(id: number, amount: number): Promise<UserPoint> {
    this.isValid(id, amount);
    return await this.pointRepository.charge(id, amount);
  }

  async use(id: number, amount: number): Promise<UserPoint> {
    this.isValid(id, amount);
    return await this.pointRepository.use(id, amount);
  }

  private isValid(id: number, amount: number) {
    if (id < 0) throw new Error(`올바르지 않은 ID 값 입니다.`);
    if (amount < 0) throw new Error(`포인트가 0보다 작습니다.`);
  }
}

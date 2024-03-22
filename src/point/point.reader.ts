import { PointHistories, UserPoint } from './point.model';
import { IPointRepository } from './interfaces/point.repository';

export class PointReader {
  constructor(private readonly pointRepository: IPointRepository) {}

  async point(id: number): Promise<UserPoint> {
    this.isValid(id);
    return await this.pointRepository.point(id);
  }

  async histories(id: number): Promise<PointHistories> {
    this.isValid(id);
    return await this.pointRepository.histories(id);
  }

  private isValid(id: number) {
    if (id < 0) throw new Error(`올바르지 않은 ID 값 입니다.`);
    return;
  }
}

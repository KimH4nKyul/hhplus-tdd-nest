import { UserPoint } from './point.model';
import { PointDto } from './point.dto';
import { IPointRepository } from './interfaces/point.repository';

export class PointHandler {
  constructor(private readonly pointRepository: IPointRepository) {}

  async charge(id: number, pointDto: PointDto): Promise<UserPoint> {
    this.isValid(id, pointDto.amount);
    return await this.pointRepository.charge(id, pointDto.amount);
  }

  async use(id: number, pointDto: PointDto): Promise<UserPoint> {
    this.isValid(id, pointDto.amount);
    return await this.pointRepository.use(id, pointDto.amount);
  }

  private isValid(id: number, amount: number) {
    if (id < 0) throw new Error(`올바르지 않은 ID 값 입니다.`);
    if (amount < 0) throw new Error(`포인트가 0보다 작습니다.`);
    return;
  }
}

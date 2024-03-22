import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PointHistories, UserPoint } from '../model/point.model';
import { IPointRepository } from '../repository/point.repository';

@Injectable()
export class PointReader {
  constructor(
    @Inject('IPointRepository')
    private readonly pointRepository: IPointRepository,
  ) {}

  async point(id: number): Promise<UserPoint> {
    this.isValid(id);
    return await this.pointRepository.point(id);
  }

  async histories(id: number): Promise<PointHistories> {
    this.isValid(id);
    return await this.pointRepository.histories(id);
  }

  private isValid(id: number) {
    if (id < 0) throw new BadRequestException(`올바르지 않은 ID 값 입니다.`);
  }
}

import { PointDto } from '../controller/dtos/point.dto';
import { PointHandler } from './point.handler';
import { PointReader } from './point.reader';
import { PointHistories, UserPoint } from '../model/point.model';

export class PointService {
  constructor(
    private readonly pointHandler: PointHandler,
    private readonly pointReader: PointReader,
  ) {}

  async point(id: number): Promise<UserPoint> {
    return await this.pointReader.point(id);
  }

  async histories(id: number): Promise<PointHistories> {
    return await this.pointReader.histories(id);
  }

  async charge(id: number, pointDto: PointDto): Promise<UserPoint> {
    return await this.pointHandler.charge(id, pointDto.amount);
  }

  async use(id: number, pointDto: PointDto): Promise<UserPoint> {
    return await this.pointHandler.use(id, pointDto.amount);
  }
}

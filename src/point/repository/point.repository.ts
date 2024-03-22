import { PointHistories, UserPoint } from 'src/point/model/point.model';

export interface IPointRepository {
  point(id: number): Promise<UserPoint>;
  histories(id: number): Promise<PointHistories>;
  use(id: number, amount: number): Promise<UserPoint>;
  charge(id: number, amount: number): Promise<UserPoint>;
}

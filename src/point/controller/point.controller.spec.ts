import { UserPointTable } from '../../database/userpoint.table';
import { PointController } from './point.controller';
import { PointDto } from './dtos/point.dto';
import { PointHandler } from '../service/point.handler';
import { PointReader } from '../service/point.reader';
import { PointHistoryTable } from '../../database/pointhistory.table';
import { PointMemoryRepository } from '../repository/point.memory.repository';
import { IPointRepository } from '../repository/point.repository';
import { PointService } from '../service/point.service';

describe(`포인트 컨트롤러`, () => {
  let controller: PointController;

  beforeAll(() => {
    const userDb = new UserPointTable();
    const historyDb = new PointHistoryTable();
    const pointRepository: IPointRepository = new PointMemoryRepository(
      userDb,
      historyDb,
    );
    const pointReader = new PointReader(pointRepository);
    const pointHandler = new PointHandler(pointRepository);
    const pointService = new PointService(pointHandler, pointReader);

    controller = new PointController(pointService);
  });

  it(`❌ 포인트를 충전할 수 없음 - 포인트가 0보다 작음`, () => {
    const userId = 1;
    const pointBody: PointDto = {
      amount: -1,
    };

    expect(controller.charge(userId, pointBody)).rejects.toThrow(
      Error(`포인트가 0보다 작습니다.`),
    );
  });

  it(`❌ 포인트를 충전할 수 없음 - 올바르지 않은 ID 값`, () => {
    const userId = -1;
    const pointBody: PointDto = {
      amount: 100,
    };

    expect(() => controller.charge(userId, pointBody)).rejects.toThrow(
      Error(`올바르지 않은 ID 값 입니다.`),
    );
  });

  it(`⭕️ 포인트를 충전할 수 있음`, async () => {
    const userId = 1;
    const pointBody: PointDto = {
      amount: 100,
    };

    await controller.charge(userId, pointBody);

    const userPoint = await controller.point(userId);

    expect(userPoint.id).toBe(userId);
    expect(userPoint.point).toBe(pointBody.amount);
  });

  it(`❌ 포인트를 사용할 수 없음 - 올바르지 않은 ID 값`, () => {
    const userId = -1;
    const pointBody: PointDto = {
      amount: 100,
    };

    expect(() => controller.use(userId, pointBody)).rejects.toThrow(
      Error(`올바르지 않은 ID 값 입니다.`),
    );
  });

  it(`❌ 포인트를 사용할 수 없음 - 포인트가 0보다 작음`, () => {
    const userId = 1;
    const pointBody: PointDto = {
      amount: -1,
    };

    expect(() => controller.use(userId, pointBody)).rejects.toThrow(
      Error(`포인트가 0보다 작습니다.`),
    );
  });

  it(`❌ 포인트를 사용할 수 없음 - 사용할 수 있는 포인트가 없거나 적음`, () => {
    const userId = 1;
    const pointBody: PointDto = {
      amount: 200,
    };

    expect(() => controller.use(userId, pointBody)).rejects.toThrow(
      Error(`사용할 수 있는 포인트가 없거나 적습니다.`),
    );
  });

  it(`⭕️ 포인트를 사용할 수 있음`, async () => {
    const userId = 1;
    const pointBody: PointDto = {
      amount: 100,
    };

    await controller.use(userId, pointBody);

    const userPoint = await controller.point(userId);

    expect(userPoint.id).toBe(userId);
    expect(userPoint.point).toBe(0);
  });

  it(`❌ 포인트를 조회할 수 없음 - 올바르지 않은 ID 값`, () => {
    const userId = -1;
    expect(() => controller.point(userId)).rejects.toThrow(
      Error(`올바르지 않은 ID 값 입니다.`),
    );
  });

  it(`⭕️ 포인트를 조회할 수 있음`, async () => {
    const userId = 1;

    const userPoint = await controller.point(userId);

    expect(userPoint.id).toBe(userId);
    expect(userPoint.point).toBe(0);
  });

  it(`❌ 포인트 충전/이용 내역을 조회할 수 없음 - 올바르지 않은 ID 값`, () => {
    const userId = -1;

    expect(controller.histories(userId)).rejects.toThrow(
      Error(`올바르지 않은 ID 값 입니다.`),
    );
  });

  it(`❌ 포인트 충전/이용 내역을 조회할 수 없음 - 내역이 없음`, () => {
    const userId = 99;

    expect(controller.histories(userId)).rejects.toThrow(
      Error(`조회 내역이 없습니다.`),
    );
  });

  it(`⭕️ 포인트 충전/이용 내역을 조회할 수 있음`, async () => {
    const userId = 1;

    const histories = await controller.histories(userId);

    expect(histories).not.toBeNull();
    expect(histories.length).toBeGreaterThanOrEqual(1);
    expect(histories[0].id).toBe(userId);
  });
});

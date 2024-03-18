import { PointController } from './point.controller';
import { PointHistoryTable } from '../database/pointhistory.table';
import { UserPointTable } from '../database/userpoint.table';
import { PointBody } from './point.dto';

describe(`포인트 컨트롤러`, () => {
  const userDb: UserPointTable = new UserPointTable();
  const historyDb: PointHistoryTable = new PointHistoryTable();
  let controller: PointController;

  beforeAll(() => {
    controller = new PointController(userDb, historyDb);
  });

  it(`❌ 포인트를 충전할 수 없음 - 포인트가 0보다 작음`, () => {
    const userId = 1;
    const pointBody: PointBody = {
      amount: -1,
    };

    expect(() => controller.charge(userId, pointBody)).rejects.toThrow(
      Error(`포인트가 0보다 작습니다.`),
    );
  });

  it(`❌ 포인트를 충전할 수 없음 - 올바르지 않은 ID 값`, () => {
    const userId = -1;
    const pointBody: PointBody = {
      amount: 100,
    };

    expect(() => controller.charge(userId, pointBody)).rejects.toThrow(
      Error(`올바르지 않은 ID 값 입니다.`),
    );
  });

  it(`⭕️ 포인트를 충전할 수 있음`, async () => {
    const userId = 1;
    const pointBody: PointBody = {
      amount: 100,
    };

    const userPoint = await controller.charge(userId, pointBody);

    expect(userPoint.id).toBe(userId);
    expect(userPoint.point).toBe(pointBody.amount);
  });

  it(`❌ 포인트를 사용할 수 없음 - 올바르지 않은 ID 값`, () => {
    const userId = -1;
    const pointBody: PointBody = {
      amount: 100,
    };

    expect(() => controller.use(userId, pointBody)).rejects.toThrow(
      Error(`올바르지 않은 ID 값 입니다.`),
    );
  });

  it(`❌ 포인트를 사용할 수 없음 - 포인트가 0보다 작음`, () => {
    const userId = 1;
    const pointBody: PointBody = {
      amount: -1,
    };

    expect(() => controller.use(userId, pointBody)).rejects.toThrow(
      Error(`포인트가 0보다 작습니다.`),
    );
  });

  it(`❌ 포인트를 사용할 수 없음 - 사용할 수 있는 포인트가 없거나 적음`, () => {
    const userId = 1;
    const pointBody: PointBody = {
      amount: 200,
    };

    expect(() => controller.use(userId, pointBody)).rejects.toThrow(
      Error(`사용할 수 있는 포인트가 없거나 적습니다.`),
    );
  });

  it(`⭕️ 포인트를 사용할 수 있음`, async () => {
    const userId = 1;
    const pointBody: PointBody = {
      amount: 100,
    };

    const userPoint = await controller.use(userId, pointBody);

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

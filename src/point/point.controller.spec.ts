import { PointController } from './point.controller';
import { PointHistoryTable } from '../database/pointhistory.table';
import { UserPointTable } from '../database/userpoint.table';
import { PointBody } from './point.dto';

describe(`포인트 컨트롤러`, () => {
  let controller: PointController;

  beforeAll(() => {
    const userDb: UserPointTable = new UserPointTable();
    const historyDb: PointHistoryTable = new PointHistoryTable();
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

  it(`✅ 여러 사용자가 동시에 포인트를 충전할 수 있음`, async () => {
    const userIds = [4, 5, 6];
    const amount = 100;

    const promises = userIds.map((id) => controller.charge(id, { amount }));

    const results = await Promise.all(promises);

    results.forEach((result, index) => {
      expect(result.id).toBe(userIds[index]);
      expect(result.point).toBe(amount);
      expect(result.updateMillis).toBeDefined();
    });
  });

  it(`✅ 여러 사용자가 동시에 포인트를 이용할 수 있음`, async () => {
    const userIds = [4, 5, 6];
    const amount = 50;

    const promises = userIds.map((id) => controller.use(id, { amount }));

    const results = await Promise.all(promises);

    for (const result of results) {
      expect(result.point).toBe(50);
      expect(result.updateMillis).toBeDefined();
    }
  });

  it(`✅ 여러 사용자가 동시에 포인트를 충전/이용할 수 있음`, async () => {
    const userIds = [4, 5, 6];
    const chargeAmount = 100;
    const useAmount = 100;

    const promises = userIds.map(async (id) => {
      await controller.charge(id, { amount: chargeAmount });
      return await controller.use(id, { amount: useAmount });
    });

    const results = await Promise.all(promises);

    for (const result of results) {
      expect(result.point).toBe(50);
    }
  });
});

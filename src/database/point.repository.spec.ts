import { PointHistoryTable } from './pointhistory.table';
import { UserPointTable } from './userpoint.table';
import { IPointRepository } from '../point/interfaces/point.repository';
import { PointMemoryRepository } from './point.memory.repository';

describe(`포인트 레포지토리`, () => {
  let pointRepository: IPointRepository;

  beforeAll(() => {
    const userDb = new UserPointTable();
    const historyDb = new PointHistoryTable();

    pointRepository = new PointMemoryRepository(userDb, historyDb);
  });

  it(`❌ 포인트를 가져올 수 없음 - 올바르지 않은 ID 값`, () => {
    const id = 0;

    expect(() => pointRepository.point(id)).rejects.toThrow(
      Error(`올바르지 않은 ID 값 입니다.`),
    );
  });

  it(`❌ 포인트를 충전할 수 없음 - 올바르지 않은 ID 값`, () => {
    const id = 0;
    const amount = 100;

    expect(() => pointRepository.charge(id, amount)).rejects.toThrow(
      Error(`올바르지 않은 ID 값 입니다.`),
    );
  });

  it(`❌ 포인트를 충전할 수 없음 - 충전할 수 있는 포인트가 없음`, () => {
    const id = 1;
    const amount = 0;

    expect(() => pointRepository.charge(id, amount)).rejects.toThrow(
      Error(`충전할 수 있는 포인트가 없습니다.`),
    );
  });

  it(`❌ 포인트를 사용할 수 없음 - 사용할 수 있는 포인트가 없거나 적음`, () => {
    const id = 1;
    const amount = 100;

    expect(() => pointRepository.use(id, amount)).rejects.toThrow(
      Error(`사용할 수 있는 포인트가 없거나 적습니다.`),
    );
  });

  it(`❌ 포인트 충전/이용 내역을 가져올 수 없음 - 조회 내역이 없음`, () => {
    const id = 1;

    expect(() => pointRepository.histories(id)).rejects.toThrow(
      Error(`조회 내역이 없습니다.`),
    );
  });

  it(`⭕️ 포인트를 가져올 수 있음`, async () => {
    const id = 1;

    const userPoint = await pointRepository.point(id);

    expect(userPoint.id).toBe(id);
    expect(userPoint.point).toBe(0);
    expect(userPoint.updateMillis).toBeDefined();
  });

  it(`⭕️ 포인트를 충전할 수 있음`, async () => {
    const id = 1;
    const amount = 100;

    const userPoint = await pointRepository.charge(id, amount);

    expect(userPoint.id).toBe(id);
    expect(userPoint.point).toBe(amount);
    expect(userPoint.updateMillis).toBeDefined();
  });

  it(`⭕️ 포인트를 사용할 수 있음`, async () => {
    const id = 1;
    const amount = 50;

    const userPoint = await pointRepository.use(id, amount);

    expect(userPoint.id).toBe(id);
    expect(userPoint.point).toBe(amount);
    expect(userPoint.updateMillis).toBeDefined();
  });

  it(`⭕️ 포인트 충전/이용 내역을 조회할 수 있음`, async () => {
    const id = 1;

    const histories = await pointRepository.histories(id);

    expect(histories).not.toBeNull();
    expect(histories.length).toBeGreaterThanOrEqual(1);
    expect(histories.at(-1).userId).toBe(id);
  });
});

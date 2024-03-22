import { TransactionType } from '../point/point.model';
import { PointHistoryTable } from './pointhistory.table';

describe(`포인트 히스토리 테이블`, () => {
  let table: PointHistoryTable;

  beforeAll(() => {
    table = new PointHistoryTable();
  });

  it(`⭕️ 포인트 히스토리 테이블에 입력할 수 있음`, async () => {
    // given
    const userId = 1;
    const amount = 100;
    const transactionType = TransactionType.CHARGE;
    const updateMillis = 1;

    // when
    const data = await table.insert(
      userId,
      amount,
      transactionType,
      updateMillis,
    );

    // then
    expect(data).not.toBeNull();
    expect(data.id).toBe(1);
    expect(data.userId).toBe(userId);
    expect(data.amount).toBe(amount);
    expect(data.timeMillis).toBe(updateMillis);
  });

  it(`⭕️ 포인트 히스토리 테이블에서 히스토리를 가져올 수 있음`, async () => {
    // given
    const userId = 1;

    // when
    const datas = await table.selectAllByUserId(1);

    // then
    expect(datas.length).toBeGreaterThanOrEqual(1);
    expect(datas[0].userId).toBe(userId);
  });
});

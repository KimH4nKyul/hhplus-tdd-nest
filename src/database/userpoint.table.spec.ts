import { UserPointTable } from './userpoint.table';

describe(`유저 포인트 테이블`, () => {
  let table: UserPointTable;

  beforeAll(() => {
    table = new UserPointTable();
  });

  it(`❌ 유저 포인트 테이블에서 포인트를 가져올 수 없음 - 올바르지 않은 ID 값`, () => {
    // given
    const id = 0;

    // then
    expect(async () => {
      table.selectById(id);
    }).rejects.toThrow(Error('올바르지 않은 ID 값 입니다.'));
  });

  it(`⭕️ 유저 포인트 테이블에 입력할 수 있음`, async () => {
    // given
    const id = 1;
    const amount = 100;

    // when
    const data = await table.insertOrUpdate(id, amount);

    // then
    expect(data).not.toBeNull();
    expect(data.id).toBe(id);
    expect(data.point).toBe(amount);
  });

  it(`⭕️ 유저 포인트 테이블에 업데이트할 수 있음`, async () => {
    // given
    const id = 1;
    const amount = 200;

    // when
    const data = await table.insertOrUpdate(id, amount);

    // then
    expect(data).not.toBeNull();
    expect(data.id).toBe(id);
    expect(data.point).toBe(amount);
  });

  it(`⭕️ 유저 포인트 테이블에서 포인트를 가져올 수 있음`, async () => {
    // given
    const id = 1;

    // when
    const data = await table.selectById(id);

    // then
    expect(data).not.toBeNull();
    expect(data.id).toBe(id);
    expect(data.point).toBe(200);
  });
});

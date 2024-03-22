export type UserId = number;

export type UserPoint = {
  id: UserId;
  point: number;
  updateMillis: number;
};

/**
 * 포인트 트랜잭션 종류
 * - CHARGE : 충전
 * - USE : 사용
 */
export enum TransactionType {
  CHARGE,
  USE,
}

export type PointHistory = {
  id: number;
  userId: UserId;
  type: TransactionType;
  amount: number;
  timeMillis: number;
};

export type PointHistories = PointHistory[];

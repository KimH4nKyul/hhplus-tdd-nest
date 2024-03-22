export interface IPointQueue {
  enqueue(task: () => Promise<void>): Promise<void>;
}

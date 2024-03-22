import { IPointQueue } from './interfaces/point.queue';

export class PointMemoryQueue implements IPointQueue {
  private tasks: Array<() => Promise<void>> = [];
  private busy: boolean = false;

  async enqueue(task: () => Promise<void>): Promise<void> {
    const taskPromise = new Promise<void>((resolve, reject) => {
      this.tasks.push(() => task().then(resolve).catch(reject));
    });

    if (!this.busy) {
      this.busy = true;
      setImmediate(() => this.process());
    }

    return taskPromise;
  }

  private async process() {
    while (this.tasks.length > 0) {
      const task = this.tasks.shift();
      if (task) await task();
    }
    this.busy = false;
  }
}

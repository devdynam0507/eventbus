import { DROP_LATER, RUN } from "./eventbusActions";

export interface Bus {
  lastRunTime: number;
  queue: [];
  context: Generator<never, void, unknown>;
}

export interface BusAction {
  busName: string;
  actionType: string;
  dropTime: number;
  runner: () => void;
}

export class EventStream {
  nextRunTimeMills: number = -1;

  *context() {
    while (true) {
      const task = yield
      const dropTime = task !== undefined ? task.dropTime : 0;
      const now = Date.now();
      if (task !== undefined && (this.nextRunTimeMills === -1 || this.nextRunTimeMills < now)) {
        task.runner();
        this.nextRunTimeMills = Date.now() + dropTime;
      }
    }
  }
}

export class EventBus {
  private readonly busStorage: {} = {};

  createStream(busName: string) {
    if (busName in this.busStorage) {
      return;
    }
    const eventStream = new EventStream();
    const eventStreamContext = eventStream.context();
    eventStreamContext.next();
    this.busStorage[busName] = {
      eventStream,
      eventStreamContext,
    };
  }

  *context() {
    while (true) {
      const action: BusAction = yield;
      const eventStreamContext: Generator<never, void, unknown> = 
        this.busStorage[action.busName].eventStreamContext;
      switch (action.actionType) {
        case RUN:
          eventStreamContext.next({
            runner: action.runner,
            dropTime: 0
          })
          break;
        case DROP_LATER:
          eventStreamContext.next({
            runner: action.runner,
            dropTime: action.dropTime,
          })
          break;
        default:
          break;
      }
    }
  }
}

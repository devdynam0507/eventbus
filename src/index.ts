import { BusAction, EventBus } from "./eventbus";

const bus: EventBus = new EventBus();
const context = bus.context();
context.next();

const useEventBus = (busName: string) => {
  bus.createStream(busName);
  return (action: BusAction) => {
    context.next(action);
  };
};


export default useEventBus;
import type { Unsubscribe } from 'redux';

function isCallable(fn: unknown): fn is CallableFunction {
  return typeof fn === 'function';
}

export class Subject<ListenerType> {
  private value: ListenerType;

  private listeners: ((params: ListenerType) => void)[];

  constructor(initialValue: ListenerType) {
    this.value = initialValue;
    this.listeners = [];
  }

  public subscribe(listener: (params: ListenerType) => void): Unsubscribe {
    this.listeners.push(listener);
    this.notify(this.value);
    return () => {
      this.listeners = this.listeners.filter((elem) => elem !== listener);
    };
  }

  public unsubscribe(listener: (params: ListenerType) => void): void {
    this.listeners = this.listeners.filter((elem) => elem !== listener);
  }

  public notify(params: (previousValue: ListenerType) => ListenerType): void;
  public notify(params: ListenerType): void;
  public notify(
    params: ListenerType | (CallableFunction & ((previousValue: ListenerType) => ListenerType)),
  ): void {
    if (isCallable(params)) {
      this.value = params(this.value);
    } else {
      this.value = params;
    }

    this.listeners.forEach((listener) => {
      listener(this.value);
    });
  }

  public getValue(): ListenerType {
    return this.value;
  }
}

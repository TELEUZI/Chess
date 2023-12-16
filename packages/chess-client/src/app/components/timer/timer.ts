import type Time from '../../interfaces/time';
import TimerModel from './timer-model';
import TimerView from './timer-view';

const LAST_SINGLE_DIGIT_WITH_LEADING_ZERO = 9;
export default class Timer {
  private readonly model: TimerModel;

  private readonly view: TimerView;

  private isRunning = true;

  private currentTime = '';

  constructor() {
    this.view = new TimerView();
    this.model = new TimerModel(this.updateView.bind(this));
  }

  public start(delay: number): void {
    setTimeout(() => {
      this.model.start();
    }, delay);
  }

  public getNode(): HTMLElement {
    return this.view.getNode();
  }

  public toggle(): void {
    if (this.isRunning) {
      this.isRunning = false;
      this.model.stop();
    } else {
      this.isRunning = true;
      this.model.start();
    }
  }

  public getSeconds(): number {
    return this.model.getCurrentTimeInSeconds();
  }

  public getTime(): string {
    return this.currentTime;
  }

  private getCurrentTime(currentTime: Time): string {
    this.currentTime = `${
      currentTime.minutes <= LAST_SINGLE_DIGIT_WITH_LEADING_ZERO
        ? `0${currentTime.minutes}`
        : currentTime.minutes
    }:${
      currentTime.seconds <= LAST_SINGLE_DIGIT_WITH_LEADING_ZERO
        ? `0${currentTime.seconds}`
        : currentTime.seconds
    }`;
    return this.currentTime;
  }

  private updateView(currentTime: Time): void {
    this.view.setTime(this.getCurrentTime(currentTime));
  }
}

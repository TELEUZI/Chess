import type Time from './time';

const SECONDS_PER_MINUTE = 60;
const MILLISECONDS_IN_ONE_SECOND = 1000;
const FIRST_DIGIT_IN_ARABIC_NUMERAL_SYSTEM = 0;

export default class TimerModel {
  private currentTimeInSeconds: number;

  private interval = 0;

  private minutes: number;

  private seconds: number;

  constructor(private readonly onTick: (value: Time) => void) {
    this.minutes = FIRST_DIGIT_IN_ARABIC_NUMERAL_SYSTEM;
    this.seconds = FIRST_DIGIT_IN_ARABIC_NUMERAL_SYSTEM;
    this.currentTimeInSeconds = FIRST_DIGIT_IN_ARABIC_NUMERAL_SYSTEM;
  }

  public start = (): void => {
    this.interval = window.setInterval(this.tick, MILLISECONDS_IN_ONE_SECOND);
  };

  public stop = (): void => {
    clearInterval(this.interval);
  };

  public getCurrentTimeInSeconds(): number {
    return this.currentTimeInSeconds;
  }

  private readonly tick = (): void => {
    this.currentTimeInSeconds += 1;
    this.onTick(this.getTime());
  };

  private getTime(): Time {
    this.minutes = Math.floor(this.currentTimeInSeconds / SECONDS_PER_MINUTE);
    this.seconds = this.currentTimeInSeconds - this.minutes * SECONDS_PER_MINUTE;
    return { minutes: this.minutes, seconds: this.seconds };
  }
}

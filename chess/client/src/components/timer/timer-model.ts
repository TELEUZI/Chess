import Time from '../../interfaces/time';

const SECONDS_PER_MINUTE = 60;
const MILLISECONDS_IN_ONE_SECOND = 1000;
const FIRST_DIGIT_IN_ARABIC_NUMERAL_SYSTEM = 0;

export default class TimerModel {
  private currentTimeInSeconds: number;

  onTick: (value: Time) => void;

  private interval: NodeJS.Timeout;

  private minutes: number;

  private seconds: number;

  constructor() {
    this.minutes = FIRST_DIGIT_IN_ARABIC_NUMERAL_SYSTEM;
    this.seconds = FIRST_DIGIT_IN_ARABIC_NUMERAL_SYSTEM;
    this.currentTimeInSeconds = FIRST_DIGIT_IN_ARABIC_NUMERAL_SYSTEM;
  }

  start = (): void => {
    this.interval = setInterval(this.tick, MILLISECONDS_IN_ONE_SECOND);
  };

  stop = (): void => {
    clearInterval(this.interval);
  };

  private tick = (): void => {
    this.currentTimeInSeconds += MILLISECONDS_IN_ONE_SECOND / MILLISECONDS_IN_ONE_SECOND;
    if (this.onTick) {
      this.onTick(this.getTime());
    }
  };

  getTime(): Time {
    this.minutes = Math.floor(this.currentTimeInSeconds / SECONDS_PER_MINUTE);
    this.seconds = this.currentTimeInSeconds - this.minutes * SECONDS_PER_MINUTE;
    return { minutes: this.minutes, seconds: this.seconds };
  }

  getSeconds(): number {
    return this.currentTimeInSeconds;
  }
}

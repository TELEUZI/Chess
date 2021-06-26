import BaseComponent from '../base-component';

const START_TIME = '00:00';
export default class TimerView extends BaseComponent {
  constructor() {
    super('div', ['timer']);
    this.setContent(START_TIME);
  }

  onUpdate: () => void;

  setTime(currentTime: string): void {
    this.setContent(currentTime);
  }
}

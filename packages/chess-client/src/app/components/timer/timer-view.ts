import BaseComponent from '../base-component';

const START_TIME = '00:00';
export default class TimerView extends BaseComponent {
  constructor() {
    super({ tag: 'div', className: 'countdown' });
    this.setInnerHTML(`
    <div class='tiles'>${START_TIME}</div>
    <div class="countdown__label">Time Passed</div>`);
  }

  setTime(currentTime: string): void {
    this.setInnerHTML(`
    <div class='tiles'>${currentTime}</div>
    <div class="countdown__label">Time Passed</div>`);
  }
}

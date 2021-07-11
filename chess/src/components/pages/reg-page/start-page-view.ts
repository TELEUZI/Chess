import BaseComponent from '../../base-component';
import Button from '../../button/button';
import { changeName, setUserColor } from '../game-page/chess-game/state/redux/reducer';
import store from '../game-page/chess-game/state/redux/store';
import PlayerContainer from './reg-page__components/player-control';

export const socket = new WebSocket('ws://localhost:8000');
export default class StartPageView extends BaseComponent {
  playerOne: PlayerContainer;

  playerTwo: PlayerContainer;

  startGameWithBot: Button;

  startButton: Button;

  gameModeButton: Button;

  gameControlButtons: BaseComponent;

  constructor() {
    super('div', ['reg-page']);

    this.gameControlButtons = new BaseComponent('div', ['game-control']);
    this.startButton = new Button('Play offline');
    this.gameModeButton = new Button('Play online', ['button'], () => {
      console.log('click');
      socket.send(JSON.stringify({ type: 'start', name: this.playerOne.getUserName() }));
    });
    socket.onmessage = (event: MessageEvent<string>) => {
      const info = JSON.parse(event.data);
      console.log(info);
      if (info.type === 'pending') {
        console.log('Waiting for player');
      }
      if (info.type === 'start') {
        window.location.hash = '#game';
        store.dispatch(setUserColor(info.payload.color));
      }
      // console.log('message');
      // console.log(JSON.parse(event.data));
      // console.log(event.data);
      // this.playerTwo.setUserName(event.data);
    };
    socket.onclose = (event) => {
      console.log('closed');
    };
    this.startGameWithBot = new Button('Play with computer');
    this.gameControlButtons.insertChilds([
      this.startButton,
      this.gameModeButton,
      this.startGameWithBot,
    ]);
    this.playerOne = new PlayerContainer('Player 1');
    this.playerTwo = new PlayerContainer('Player 2');
    this.playerOne.onSubmit = (name: string) =>
      store.dispatch(
        changeName({
          playerOne: name,
          playerTwo: this.playerTwo.getUserName(),
        }),
      );
    this.playerTwo.onSubmit = (name: string) => {
      socket.send(JSON.stringify({ type: 'name', data: name }));
      store.dispatch(
        changeName({
          playerOne: this.playerOne.getUserName(),
          playerTwo: name,
        }),
      );
    };
    this.insertChilds([this.playerOne, this.gameControlButtons, this.playerTwo]);
  }
}

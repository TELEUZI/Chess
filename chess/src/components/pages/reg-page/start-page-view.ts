import BaseComponent from '../../base-component';
import Button from '../../button/button';
import { changeName } from '../game-page/chess-game/state/redux/reducer';
import store from '../game-page/chess-game/state/redux/store';
import PlayerContainer from './reg-page__components/player-control';

export default class StartPageView extends BaseComponent {
  playerOne: PlayerContainer;

  playerTwo: PlayerContainer;

  startGameWithBot: Button;

  startButton: Button;

  gameModeButton: Button;

  gameControlButtons: BaseComponent;

  constructor() {
    super('div', ['reg-page']);
    const socket = new WebSocket('ws://localhost:8000');
    this.gameControlButtons = new BaseComponent('div', ['game-control']);
    this.startButton = new Button('Play offline');
    this.gameModeButton = new Button('Play online');
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

    socket.onopen = (e) => {
      socket.onmessage = (event: MessageEvent<string>) => {
        console.log('message');
        console.log(JSON.parse(event.data));
        console.log(event.data);
        this.playerTwo.setUserName(event.data);
      };
    };
  }
}

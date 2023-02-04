import GameMode from '../../../enums/game-mode';
import type PageController from '../../../interfaces/page';
import { addUserToGame } from '../../../services/websocket-service';
import redirectToGameWithMode from '../../../utils/start-game-utils';
import { changeName } from '../game-page/chess-game/state/redux/action-creators';
import store from '../game-page/chess-game/state/redux/store';

import StartPageView from './start-page-view';

export function onUserNameChanged(firstUserName: string, secondtUserName: string): void {
  store.dispatch(
    changeName({
      playerOne: firstUserName,
      playerTwo: secondtUserName,
    }),
  );
}
export default class StartPage implements PageController {
  private readonly root: HTMLElement;

  private readonly view: StartPageView;

  constructor(root: HTMLElement) {
    this.root = root;
    this.view = new StartPageView();
    this.view.onStartMultiplayerGame = async () => addUserToGame(this.view.playerOne.getUserName());
    this.view.onStartSingleGame = redirectToGameWithMode.bind(null, GameMode.SINGLE);
    this.view.onStartGameWithBot = redirectToGameWithMode.bind(null, GameMode.BOT);
    this.view.onUserNameChanged = (firstUserName: string, secondtUserName: string) => {
      onUserNameChanged(firstUserName, secondtUserName);
    };
  }

  createPage(): void {
    this.root.append(this.view.getNode());
  }
}

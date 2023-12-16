import GameMode from '../../enums/game-mode';
import type PageController from '../../interfaces/page';
import { addUserToGame } from '../../services/websocket-service';
import redirectToGameWithMode from '../../utils/start-game-utils';
import { changeName } from '../game-page/chess-game/state/redux/action-creators';
import store from '../game-page/chess-game/state/redux/store';

import StartPageView from './start-page-view';

export function onUserNameChanged(firstUserName: string, secondUserName: string): void {
  store.dispatch(
    changeName({
      playerOne: firstUserName,
      playerTwo: secondUserName,
    }),
  );
}
export default class StartPage implements PageController {
  private readonly root: HTMLElement;

  private readonly view: StartPageView;

  constructor(root: HTMLElement) {
    this.root = root;
    this.view = new StartPageView(
      redirectToGameWithMode.bind(null, GameMode.SINGLE),
      redirectToGameWithMode.bind(null, GameMode.BOT),
      async () => addUserToGame(this.view.playerOne.getUserName()),
      (firstUserName: string, secondUserName: string) => {
        onUserNameChanged(firstUserName, secondUserName);
      },
    );
  }

  public createPage(): void {
    this.root.append(this.view.getNode());
  }
}

import { addUserToGame, storeService } from '@chess/game-engine';
import type { PageController } from '@chess/game-common';
import { GameMode } from '@chess/game-common';
import { redirectToGameWithMode } from '@client/app/utils/start-game-utils';

import StartPageView from './start-page-view';

export function onUserNameChanged(firstUserName: string, secondUserName: string): void {
  storeService.updateUserNames(firstUserName, secondUserName);
}
export default class StartPage implements PageController {
  private readonly root: HTMLElement;

  private readonly view: StartPageView;

  constructor(root: HTMLElement) {
    this.root = root;
    this.view = new StartPageView(
      () => {
        redirectToGameWithMode(GameMode.SINGLE);
      },
      () => {
        redirectToGameWithMode(GameMode.BOT);
      },
      () => addUserToGame(this.view.playerOne.getUserName()),
      onUserNameChanged,
    );
  }

  public createPage(): void {
    this.root.append(this.view.getNode());
  }

  public destroyPage(): void {
    this.view.destroy();
  }
}

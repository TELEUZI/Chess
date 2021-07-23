import BaseComponent from '../../base-component';
import PageController from '../../../interfaces/page';
import store from '../game-page/chess-game/state/redux/store';
import GameMode from '../../../enums/game-mode';
import { setGameMode, setReplayState } from '../game-page/chess-game/state/redux/action-creators';
import ReplayDaoService from '../../../services/replay-dao-service';
import Card from '../../card/card';
import FigureColor from '../../../enums/figure-colors';
import { Winner } from '../../../interfaces/winner';

export default class BestScorePage implements PageController {
  private root: HTMLElement;

  private replayModel: ReplayDaoService;

  constructor(root: HTMLElement) {
    this.root = root;
    this.replayModel = ReplayDaoService.getInstance();
  }

  async createPage(): Promise<void> {
    const cards = await this.replayModel.getAll();
    const cardContainer = new BaseComponent('div', ['card-container']);
    cards.forEach((card) => {
      let gameResult: Winner;
      if (card.result === FigureColor.WHITE) {
        gameResult = 'White';
      } else if (card.result === FigureColor.BLACK) {
        gameResult = 'Black';
      } else {
        gameResult = 'No one';
      }
      const cardView = new Card(
        card.players[0].name,
        card.players[1].name,
        card.date,
        card.moves,
        gameResult,
        () => {
          store.dispatch(setGameMode(GameMode.REPLAY));
          store.dispatch(setReplayState(card.date));
          window.location.hash = 'watch';
        },
      );
      cardContainer.insertChild(cardView);
    });
    this.root.appendChild(cardContainer.getNode());
  }
}

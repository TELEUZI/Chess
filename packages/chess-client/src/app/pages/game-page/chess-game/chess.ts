import type { Coordinate } from '@coordinate';
import FigureColor from '@client/app/enums/figure-colors';
import FigureColorText from '@client/app/enums/figure-color-text';
import BaseComponent from '../../../components/base-component';
import Timer from '../../../components/timer/timer';
import ChessField from './field/field-controller';
import PlayerContainer from '../../reg-page/reg-page__components/player-control';
import store from './state/redux/store';
import ChessHistory from './chess-history';
import ModalWindow from '../../reg-page/modal-window';
import ModalContent from '../../reg-page/modal-content';
import getNextFigureColor from '../../../utils/get-next-figure-color';
import ReplayDaoService from '../../../services/replay-dao-service';
import type { TimedMoveMessage } from '../../../interfaces/move-message';
import { setWinner } from './state/redux/action-creators';
import type { GameResult } from '../../../interfaces/replay';
import type Replay from '../../../interfaces/replay';
import { socketService } from '../../../services/websocket-service';
import { TIMER_DELAY } from '../../../config';
import type TurnInfo from '../../../interfaces/turn-info';

const IS_UPDATABLE = false;
class Chess extends BaseComponent {
  private readonly timer: Timer;

  private readonly playerOne: PlayerContainer;

  private readonly playerTwo: PlayerContainer;

  private readonly chessBoard: ChessField;

  private readonly replayModel: ReplayDaoService;

  private readonly chessHistory: ChessHistory;

  private readonly history: TimedMoveMessage[] = [];

  private replay: Replay | null = null;

  constructor(parentNode: HTMLElement, isReplay: boolean) {
    super({ tag: 'div', className: 'chess-wrapper', parent: parentNode });
    this.replayModel = ReplayDaoService.getInstance();
    if (!isReplay) {
      this.createReplay();
    }
    this.timer = new Timer();
    this.timer.start(TIMER_DELAY);
    this.node.append(this.timer.getNode());
    const chessBoardWrapper = new BaseComponent({
      className: 'chess',
      parent: this.node,
    });
    const chessHead = new BaseComponent({ className: 'chess__head', parent: chessBoardWrapper });
    this.playerOne = new PlayerContainer(store.getState().players.playerOne, IS_UPDATABLE);
    this.playerTwo = new PlayerContainer(store.getState().players.playerTwo, IS_UPDATABLE);
    const chessBody = new BaseComponent({ className: 'chess__body', parent: chessBoardWrapper });
    this.chessHistory = new ChessHistory(chessBody.getNode());
    this.chessBoard = new ChessField({
      parentNode: chessBody.getNode(),
      onEnd: () => {
        this.timer.toggle();
      },
      onMate: () => {
        store.dispatch(
          setWinner(getNextFigureColor(store.getState().currentPlayer.currentUserColor)),
        );
        this.setWinner(store.getState().winner.winnerColor);
        this.showMateModal();
      },
      onStalemate: () => {
        this.showStalemateModal();
        this.setWinner(store.getState().winner.winnerColor);
      },
      onFieldUpdate: (turnInfo: TurnInfo) => {
        this.chessHistory.setHistoryMove(turnInfo, this.timer.getTime());
        if (!isReplay) {
          this.pushMoveToHistory(turnInfo);
        }
      },
      onNextTurn: () => {
        this.nextTurnHandler();
      },
    });
    this.playerOne.toggleClass('current');
    chessHead.appendChildren([this.playerOne, this.playerTwo]);
    socketService.onPlayerLeave = () => {
      this.setPlayerLeave();
    };
    socketService.onPlayerDrawSuggest = () => {
      this.showDrawProposalModal();
    };
    socketService.onPlayerDrawResponse = (result: boolean) => {
      if (result) {
        this.setDraw();
      }
    };
  }

  private pushMoveToHistory(turnInfo: TurnInfo): void {
    this.history.push({
      from: turnInfo.move.from,
      to: turnInfo.move.to,
      time: this.timer.getSeconds(),
    });
  }

  private showDrawProposalModal(): void {
    const winContent = new ModalContent({
      header: 'Are you ok with draw?',
      text: `...`,
      buttonText: 'Ok',
    });
    const modalWindow = new ModalWindow(
      winContent,
      null,
      async () => {
        await socketService.answerDraw({ isDraw: true });
      },
      async () => {
        await socketService.answerDraw({ isDraw: false });
      },
    );
    this.node.append(modalWindow.getNode());
  }

  private showStalemateModal(): void {
    const winContent = new ModalContent({
      header: 'Stalemate!',
      text: `It isn't win, just a draw, bro.`,
      buttonText: "It's a pity!",
    });
    const modalWindow = new ModalWindow(winContent);
    this.node.append(modalWindow.getNode());
  }

  private showMateModal(): void {
    const winContent = new ModalContent({
      header: 'Check and mate!',
      text: `Player of ${
        store.getState().winner.winnerColor === FigureColor.BLACK
          ? FigureColorText.WHITE
          : FigureColorText.BLACK
      } has won!`,
      buttonText: 'Ok',
    });
    const modalWindow = new ModalWindow(winContent);
    this.node.append(modalWindow.getNode());
  }

  public setPlayerLeave(): void {
    const result = getNextFigureColor(store.getState().currentPlayer.currentUserColor);
    this.setWinner(result);
    const winContent = new ModalContent({
      header: 'User leaves!',
      text: `Player of ${
        result === FigureColor.WHITE ? FigureColorText.WHITE : FigureColorText.BLACK
      } has won!`,
      buttonText: 'Ok',
    });
    const modalWindow = new ModalWindow(winContent);
    this.node.append(modalWindow.getNode());
  }

  private setDraw(): void {
    const winContent = new ModalContent({
      header: 'Stalemate!',
      text: `It isn't win, just a draw, bro.`,
      buttonText: "It's a pity!",
    });
    const modalWindow = new ModalWindow(winContent);
    this.node.append(modalWindow.getNode());
    this.setWinner('draw');
  }

  public async makeMove(from: Coordinate, to: Coordinate): Promise<void> {
    await this.chessBoard.makeMove(from.x, from.y, to.x, to.y);
  }

  private setWinner(result: GameResult): void {
    if (!this.replay) {
      return;
    }
    this.replay.history = [...this.history];
    this.replay.result = result;
    this.replay.moves = this.history.length;
    this.replayModel.createReplayFromObject(this.replay);
    this.replay = null;
  }

  private createReplay(): void {
    this.replay = {
      date: new Date().getTime(),
      history: [],
      mode: store.getState().gameMode.currentGameMode,
      players: [
        {
          name: store.getState().players.playerOne,
          color: store.getState().color.color,
          avatar: '',
        },
        {
          name: store.getState().players.playerTwo,
          color: getNextFigureColor(store.getState().color.color),
          avatar: '',
        },
      ],
      result: null,
      moves: 0,
    };
  }

  public stopTimer(): void {
    this.timer.toggle();
  }

  private nextTurnHandler(): void {
    this.playerOne.toggleClass('current');
    this.playerTwo.toggleClass('current');
  }
}

export default Chess;

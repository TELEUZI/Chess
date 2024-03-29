import type { Coordinate } from '@chess/coordinate';
import BaseComponent from '@components/base-component';
import Timer from '@components/timer/timer';
import ModalContent from '@components/modal/modal-content';
import type { GameResult, Replay, TimedMoveMessage, TurnInfo } from '@chess/game-common';
import { FigureColor } from '@chess/game-common';
import PlayerContainer from '@client/app/pages/reg-page/components/player-control';
import { FigureColorText, socketService, storeService } from '@chess/game-engine';
import { TIMER_DELAY } from '@chess/config';
import { ReplayDaoService } from '@chess/dao';
import { ModalWindow } from '@components/modal/modal-window';
import ChessField from './field/field-controller';
import { ChessHistory } from './history/chess-history';

class Chess extends BaseComponent {
  private readonly timer: Timer;

  private readonly playerOne: PlayerContainer;

  private readonly playerTwo: PlayerContainer;

  private readonly chessBoard: ChessField;

  private readonly replayModel: ReplayDaoService;

  private readonly chessHistory: ChessHistory;

  private readonly history: TimedMoveMessage[] = [];

  private replay: Replay | null = null;

  private readonly unsubscribes: (() => void)[] = [];

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
    this.playerOne = new PlayerContainer(storeService.getFirstPlayerName(), false);
    this.playerTwo = new PlayerContainer(storeService.getSecondPlayerName(), false);
    const chessBody = new BaseComponent({ className: 'chess__body', parent: chessBoardWrapper });
    this.chessHistory = new ChessHistory(chessBody.getNode());
    this.chessBoard = new ChessField({
      parentNode: chessBody.getNode(),
      onEnd: () => {
        this.timer.toggle();
      },
      onMate: () => {
        storeService.setWinner(storeService.getOpponentColor());
        this.setWinner(storeService.getWinnerColor() ?? 'draw');
        this.showMateModal();
      },
      onStalemate: () => {
        this.showStalemateModal();
        this.setWinner(storeService.getWinnerColor() ?? 'draw');
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
    chessHead.appendChildren([this.playerOne.getNode(), this.playerTwo.getNode()]);
    this.unsubscribes.push(
      socketService.playerLeave$.subscribe(() => {
        this.setPlayerLeave();
      }),
      socketService.playerDrawResponse$.subscribe(() => {
        this.showDrawProposalModal();
      }),
      socketService.playerDrawResponse$.subscribe((result: boolean) => {
        if (result) {
          this.setDraw();
        }
      }),
    );
  }

  public setPlayerLeave(): void {
    const result = storeService.getOpponentColor();
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

  public async makeMove(from: Coordinate, to: Coordinate): Promise<void> {
    await this.chessBoard.makeMove(from.x, from.y, to.x, to.y);
  }

  public stopTimer(): void {
    this.timer.toggle();
  }

  public override destroy(): void {
    super.destroy();
    this.chessBoard.destroy();
  }

  private pushMoveToHistory(turnInfo: TurnInfo): void {
    this.history.push({
      from: turnInfo.move.from,
      to: turnInfo.move.to,
      time: this.timer.getSeconds(),
    });
  }

  private setDraw(): void {
    const winContent = new ModalContent({
      header: 'Stalemate!',
      text: "It isn't win, just a draw, bro.",
      buttonText: "It's a pity!",
    });
    const modalWindow = new ModalWindow(winContent);
    this.node.append(modalWindow.getNode());
    this.setWinner('draw');
  }

  private showDrawProposalModal(): void {
    const winContent = new ModalContent({
      header: 'Are you ok with draw?',
      text: '...',
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
      text: "It isn't win, just a draw, bro.",
      buttonText: "It's a pity!",
    });
    const modalWindow = new ModalWindow(winContent);
    this.node.append(modalWindow.getNode());
  }

  private showMateModal(): void {
    const winContent = new ModalContent({
      header: 'Check and mate!',
      text: `Player of ${
        storeService.getWinnerColor() === FigureColor.BLACK
          ? FigureColorText.WHITE
          : FigureColorText.BLACK
      } has won!`,
      buttonText: 'Ok',
    });
    const modalWindow = new ModalWindow(winContent);
    this.node.append(modalWindow.getNode());
  }

  private setWinner(result: GameResult): void {
    if (!this.replay) {
      return;
    }
    this.replay.history = [...this.history];
    this.replay.result = result;
    this.replay.moves = this.history.length;
    void this.replayModel.createReplayFromObject(this.replay);
    this.replay = null;
  }

  private createReplay(): void {
    this.replay = {
      date: new Date().getTime(),
      history: [],
      mode: storeService.getGameMode(),
      players: [
        {
          name: storeService.getFirstPlayerName(),
          color: storeService.getUserColor(),
          avatar: '',
        },
        {
          name: storeService.getSecondPlayerName(),
          color: storeService.getOpponentColor(),
          avatar: '',
        },
      ],
      result: null,
      moves: 0,
    };
  }

  private nextTurnHandler(): void {
    this.playerOne.toggleClass('current');
    this.playerTwo.toggleClass('current');
  }
}

export default Chess;

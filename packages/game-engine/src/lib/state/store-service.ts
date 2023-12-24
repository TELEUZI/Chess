import type { FigureColor, GameMode } from '@chess/game-common';
import { getNextFigureColor } from '@chess/utils';
import { store as rootStore } from './redux/store';
import {
  changeName,
  setCurrentUserColor,
  setGameMode,
  setReplayState,
  setUserColor,
  setWinner,
} from './redux/action-creators';

class StoreService {
  constructor(private readonly store: typeof rootStore) {}

  public getGameMode(): GameMode {
    return this.store.getState().gameMode.currentGameMode;
  }

  public getWinnerColor(): FigureColor | null {
    return this.store.getState().winner.winnerColor;
  }

  public getCurrentPlayerColor(): FigureColor {
    return this.store.getState().currentPlayer.currentUserColor;
  }

  public getOpponentColor(): FigureColor {
    return getNextFigureColor(this.store.getState().currentPlayer.currentUserColor);
  }

  public getUserColor(): FigureColor {
    return this.store.getState().user.color;
  }

  public getFirstPlayerName(): string {
    return this.store.getState().players.playerOne;
  }

  public getSecondPlayerName(): string {
    return this.store.getState().players.playerTwo;
  }

  public getCurrentReplayDate(): number {
    return this.store.getState().replayDate.currentReplayDate;
  }

  public setWinner(winnerColor: FigureColor | null): void {
    this.store.dispatch(setWinner(winnerColor));
  }

  public setGameMode(gameMode: GameMode): void {
    this.store.dispatch(setGameMode(gameMode));
  }

  public updateUserNames(firstUserName: string, secondUserName: string): void {
    this.store.dispatch(
      changeName({
        playerOne: firstUserName,
        playerTwo: secondUserName,
      }),
    );
  }

  public setReplayStateDate(date: number): void {
    this.store.dispatch(setReplayState(date));
  }

  public setCurrentUserColor(color: FigureColor): void {
    this.store.dispatch(setCurrentUserColor(color));
  }

  public setUserColor(color: FigureColor): void {
    this.store.dispatch(setUserColor(color));
  }
}

export const storeService = new StoreService(rootStore);

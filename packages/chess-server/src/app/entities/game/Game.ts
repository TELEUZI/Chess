import shuffle from '../../utils/shuffle';
import Player from '../player/player';
import { PlayerColor, PlayerState } from '../player/player-enums';
import type { PlayerSerializable } from '../player/player-interfaces';
import { GameStatus } from './game-enums';
import type { GameExternalInfo, GameInfo, MoveMessage } from './game-interfaces';

export default class Game {
  private state?: string;

  private status = GameStatus.waitingRoom;

  private players = new Map<string, Player>();

  private currentPlayer: string | undefined;

  private lastMove: MoveMessage | undefined;

  public getPlayers(): Map<string, Player> {
    return this.players;
  }

  public getPlayer(token: string): Player | null {
    return this.players.get(token) ?? null;
  }

  public start(): GameInfo {
    if (this.status !== GameStatus.waitingRoom) {
      throw new Error("Game state doesn't allow for game start. Must be 'waitingRoom'.");
    }
    if (this.players.size < 2) {
      throw new Error('Game requires more than one player.');
    }
    const playersNotReadied: string[] = [];
    this.players.forEach((player) => {
      if (player.state !== PlayerState.ready) {
        playersNotReadied.push(player.name);
      }
    });
    this.status = GameStatus.running;
    const shuffledPlayersList = shuffle([...this.players.keys()]);
    const newShuffledPlayers = new Map<string, Player>();
    shuffledPlayersList.forEach((playerName, index) => {
      const playerItem = this.players.get(playerName);
      if (playerItem == null) {
        throw new Error('Could not find player values for actor.');
      }
      playerItem.color = index;
      playerItem.state = PlayerState.playing;
      newShuffledPlayers.set(playerName, playerItem);
    });
    this.players = newShuffledPlayers;
    [, this.currentPlayer] = shuffledPlayersList;
    return this.getGameStatus();
  }

  public addPlayer(name: string): PlayerSerializable {
    if (this.status !== GameStatus.waitingRoom) {
      throw new Error('Players cannot be added given game state.');
    }
    const userName = name;
    const player: Player = new Player(userName);
    this.players.set(userName, player);
    return player.getSafeToSerialize();
  }

  public move(fen: string, lastMove: MoveMessage): GameInfo {
    this.state = fen;
    this.lastMove = lastMove;
    this.currentPlayer = this.setNextPlayer();
    return this.buildGameUpdateOutput();
  }

  public buildGameExternalInfo(): GameExternalInfo {
    return {
      gameStatus: this.status,
      playerCount: this.players.size,
    };
  }

  public disconnectPlayer(name: string, reason?: string): GameInfo {
    const player = this.players.get(name);
    if (player == null) {
      throw new Error('Could not find player values for actor.');
    }
    if (this.status === GameStatus.waitingRoom) {
      this.players.delete(name);
    } else if (this.status === GameStatus.running) {
      player.disconnectionReason = reason;
      this.players.set(name, player);
      const remaining = this.getRemainingPlayers();
      this.status = GameStatus.ended;
      const victorItem = this.players.get(remaining[0]);
      if (victorItem) {
        victorItem.state = PlayerState.victor;
        this.players.set(remaining[0], victorItem);
      }
    }
    return this.getGameStatus();
  }

  public getGameStatus(): GameInfo {
    const players: PlayerSerializable[] = [];
    this.players.forEach((player: Player) => {
      if (player.state !== PlayerState.disconnected) {
        players.push(player.getSafeToSerialize());
      }
    });
    return this.buildGameUpdateOutput(players);
  }

  private getRemainingPlayers(): string[] {
    const retVal: string[] = [];
    this.players.forEach((player) => {
      if (player.state === PlayerState.playing) {
        retVal.push(player.name);
      }
    });

    return retVal;
  }

  private setNextPlayer(): string {
    if (this.currentPlayer == null) {
      throw new Error('No current player.');
    }
    const remaining = this.getRemainingPlayers();
    const indexOfCurrent = remaining.indexOf(this.currentPlayer);
    return remaining[(indexOfCurrent + 1) % remaining.length];
  }

  private buildGameUpdateOutput(players?: PlayerSerializable[]): GameInfo {
    return {
      fieldState: this.state,
      gameStatus: this.status,
      currentPlayerColor: this.findPlayerColor(this.currentPlayer ?? '') ?? PlayerColor.white,
      players: players ?? [],
      lastMove: this.lastMove,
    };
  }

  private findPlayerColor(name: string): PlayerColor | null {
    return this.players.get(name)?.color ?? null;
  }
}

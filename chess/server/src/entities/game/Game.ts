import shuffle from '../../utils/shuffle';
import Player from '../player/Player';
import { PlayerColor, PlayerState } from '../player/player-enums';
import { PlayerSerializable } from '../player/player-interfaces';
import { GameStatus } from './game-enums';
import { GameExternalInfo, GameInfo } from './game-interfaces';

export default class Game {
  private state: string;

  private status = GameStatus.waitingRoom;

  private players: Map<string, Player> = new Map();

  private currentPlayer: string | undefined;

  getPlayers(): Map<string, Player> {
    return this.players;
  }
  getPlayer(token: string): Player {
    return this.players.get(token);
  }
  private buildGameUpdateOutput(players?: PlayerSerializable[]): GameInfo {
    return {
      fieldState: this.state,
      gameStatus: this.status,
      currentPlayerColor: this.findPlayerColor(this.currentPlayer),
      players: players,
    };
  }

  findPlayerColor(name: string): PlayerColor {
    return this.players.get(name)?.color;
  }

  addPlayer(name: string): PlayerSerializable {
    if (this.status !== GameStatus.waitingRoom) {
      throw new Error('Players cannot be added given game state.');
    }
    if (this.players.has(name)) {
      throw new Error(`Player name "${name}" already in game.`);
    }

    const player: Player = new Player(name);
    this.players.set(name, player);

    return player.getSafeToSerialize();
  }

  move(fen: string): GameInfo {
    this.state = fen;
    this.currentPlayer = this.setNextPlayer();
    return this.buildGameUpdateOutput();
  }

  buildGameExternalInfo(): GameExternalInfo {
    return {
      gameStatus: this.status,
      playerCount: this.players.size,
    };
  }

  disconnectPlayer(name: string, reason?: string): GameInfo {
    const player = this.players.get(name);
    if (player == null) {
      throw new Error('Could not find player values for actor.');
    }
    if (this.status === GameStatus.waitingRoom) {
      this.players.delete(name);
    } else if (this.status === GameStatus.running) {
      player.state =
        player.state !== PlayerState.eliminated
          ? PlayerState.disconnected
          : PlayerState.eliminatedDisconnected;
      player.disconnectionReason = reason;
      this.players.set(name, player);
      const remaining = this.getRemainingPlayers();
      this.status = GameStatus.ended;
      const victorItem = this.players.get(remaining[0]) as Player;
      victorItem.state = PlayerState.victor;
      this.players.set(remaining[0], victorItem);
    }
    return this.getGameStatus();
  }

  getGameStatus(): GameInfo {
    const players: PlayerSerializable[] = [];
    this.players.forEach((player: Player) => {
      if (
        this.status !== GameStatus.ended &&
        (player.state === PlayerState.playing || player.state === PlayerState.joined)
      ) {
        players.push(player.getSafeToSerialize());
      }
    });

    return this.buildGameUpdateOutput(players);
  }

  getRemainingPlayers(): string[] {
    const retVal: string[] = [];
    this.players.forEach((player) => {
      if (player.state === PlayerState.playing) {
        retVal.push(player.name);
      }
    });

    return retVal;
  }

  setNextPlayer(): string {
    if (this.currentPlayer == null) {
      throw new Error('No current player.');
    }
    const remaining = this.getRemainingPlayers();
    const indexOfCurrent = remaining.indexOf(this.currentPlayer);
    return remaining[(indexOfCurrent + 1) % remaining.length];
  }

  start(): GameInfo {
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
    const newShuffledPlayers: Map<string, Player> = new Map();
    shuffledPlayersList.forEach((playerName, index) => {
      const playerItem = this.players.get(playerName);
      playerItem.color = index;
      playerItem.state = PlayerState.playing;
      newShuffledPlayers.set(playerName, playerItem);
    });
    this.players = newShuffledPlayers;
    [, this.currentPlayer] = shuffledPlayersList;
    return this.getGameStatus();
  }
}

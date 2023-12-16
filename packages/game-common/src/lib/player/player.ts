import { PlayerState } from './player-enums';
import type { PlayerSerializable, IPlayer } from './player-interfaces';
import type { FigureColor } from './figure-colors';

export class Player implements IPlayer {
  public name: string;

  public color: FigureColor | null;

  public state: PlayerState;

  public disconnectionReason?: string;

  public constructor(name: string) {
    this.name = name;
    this.color = null;
    this.state = PlayerState.joined;
  }

  public getSafeToSerialize(): PlayerSerializable {
    return {
      name: this.name,
      color: this.color,
      state: this.state,
    };
  }
}

import type { PlayerColor } from './player-enums';
import { PlayerState } from './player-enums';
import type { PlayerSerializable } from './player-interfaces';

export default class Player {
  name: string;

  color: PlayerColor | null;

  state: PlayerState;

  disconnectionReason?: string;

  constructor(name: string) {
    this.name = name;
    this.color = null;
    this.state = PlayerState.joined;
  }

  getSafeToSerialize(): PlayerSerializable {
    return {
      name: this.name,
      color: this.color,
      state: this.state,
    };
  }
}

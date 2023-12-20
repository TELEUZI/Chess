import type { PlayerState } from './player-enums';
import type { FigureColor } from './figure-colors';

export interface PlayerSerializable {
  name: string;
  color: FigureColor | null;
  state: PlayerState;
}

export interface IPlayer {
  name: string;
  color: FigureColor | null;
}

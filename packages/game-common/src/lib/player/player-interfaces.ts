import type { PlayerState } from './player-enums';
import type { FigureColor } from './figure-colors';

export type PlayerSerializable = Record<
  string,
  FigureColor | PlayerState | string[] | boolean | string | null
>;

export interface IPlayer {
  name: string;
  color: FigureColor | null;
}

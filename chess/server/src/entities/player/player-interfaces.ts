import { PlayerColor, PlayerState } from './player-enums';

export type PlayerSerializable = Record<
  string,
  string | null | boolean | string[] | PlayerState | PlayerColor
>;

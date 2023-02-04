import type { PlayerColor, PlayerState } from './player-enums';

export type PlayerSerializable = Record<
  string,
  PlayerColor | PlayerState | string[] | boolean | string | null
>;

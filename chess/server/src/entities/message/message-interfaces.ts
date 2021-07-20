import { GameAction } from '../game/game-enums';
import { PlayerSerializable } from '../player/player-interfaces';

export interface RoomsMessageData {
  action: GameAction;
  payload?: {
    fieldState: string;
  };
}
export interface RoomCreateResponse {
  roomCreated: boolean;
  creator: PlayerAddResponse;
  failureReason?: string;
}
export interface PlayerAddResponse {
  playerInfo: PlayerSerializable;
  playerToken?: string;
}

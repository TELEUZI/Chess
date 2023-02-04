import type { GameAction } from '../game/game-enums';
import type { GameInfo, MoveMessage } from '../game/game-interfaces';
import type { PlayerSerializable } from '../player/player-interfaces';

export interface RoomsMessageData {
  action: GameAction | null;
  payload?: {
    fieldState: string;
    isDraw: boolean;
    moveMessage: MoveMessage;
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

export interface UserSuggest {
  isDraw: boolean | null;
}
export interface WsMessage {
  action: GameAction;
  payload: GameInfo | UserSuggest;
}

import { GameAction } from '../game/game-enums';
import { GameInfo, MoveMessage } from '../game/game-interfaces';
import { PlayerSerializable } from '../player/player-interfaces';

export interface RoomsMessageData {
  action: GameAction;
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
  isDraw: boolean;
}
export interface WsMessage {
  action: GameAction;
  payload: GameInfo | UserSuggest;
}

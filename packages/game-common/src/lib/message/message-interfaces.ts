import type { GameAction, MoveMessage, PlayerSerializable } from '@chess/game-common';

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

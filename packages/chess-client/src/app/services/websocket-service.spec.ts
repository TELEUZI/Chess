/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { RoomCreateResponse, PlayerAddResponse } from '@chess/game-common';
import { GameAction, PlayerState } from '@chess/game-common';
import type { AxiosResponse } from 'axios';
import { Coordinate } from '@chess/coordinate';
import { api } from '../config';
import { SocketService } from './websocket-service';

describe('SocketService', () => {
  // create a room successfully
  it('should create a room successfully when the server response is successful', async () => {
    // Mock the api.post method to return a successful response
    const mockResponse: AxiosResponse<RoomCreateResponse> = {
      data: {
        creator: {
          playerInfo: {
            name: 'mockPlayerName',
            color: null,
            state: PlayerState.joined,
          },
          playerToken: 'mockPlayerToken',
        },
        roomCreated: false,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined as any,
      },
    };
    vi.spyOn(api, 'post').mockResolvedValue(mockResponse);

    const socketService = new SocketService();
    await socketService.createRoom('mockPlayerName');

    // Assert that the room name is set
    expect(socketService.roomName).toBeDefined();

    // Assert that the socket is created and joined to the room
    expect(socketService.socket).toBeDefined();
  });

  // join a room successfully
  it('should join a room successfully when the server response is successful', async () => {
    // Mock the api.put method to return a successful response
    const mockResponse: AxiosResponse<PlayerAddResponse> = {
      data: {
        playerInfo: {
          name: 'mockPlayerName',
          color: null,
          state: PlayerState.joined,
        },
        playerToken: 'mockPlayerToken',
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    };
    vi.spyOn(api, 'put').mockResolvedValue(mockResponse);

    const socketService = new SocketService();
    await socketService.joinRoom('mockRoom', 'mockPlayerName');

    // Assert that the socket is created and joined to the room
    expect(socketService.socket).toBeDefined();
  });

  // move a figure successfully
  // it('should move a figure successfully when the socket send is successful', async () => {
  //   const socketService = new SocketService();
  //   socketService.socket = new WebSocket('ws://localhost');
  //   const mockSend = vi.spyOn(socketService.socket, 'send');

  //   const fieldState = 'mockFieldState';
  //   const moveMessage = {
  //     // mock move message
  //     from: new Coordinate(1, 2),
  //     to: new Coordinate(3, 4),
  //   };
  //   const result = await socketService.move(fieldState, moveMessage);

  //   // Assert that the socket send method is called with the correct payload
  //   expect(mockSend).toHaveBeenCalledWith(
  //     JSON.stringify({
  //       action: GameAction.moveFigure,
  //       payload: { fieldState, moveMessage },
  //     }),
  //   );

  //   // Assert that the result is true
  //   expect(result).toBe(true);
  // });

  // fail to create a room due to server error
  it('should fail to create a room when the server response is an error', async () => {
    // Mock the api.post method to throw an error
    vi.spyOn(api, 'post').mockRejectedValue(new Error('mock error'));

    const socketService = new SocketService();
    await socketService.createRoom('mockPlayerName');

    // Assert that the socket is not created
    expect(socketService.socket).toBeUndefined();
  });

  // fail to join a room due to server error
  it('should fail to join a room when the server response is an error', async () => {
    // Mock the api.put method to throw an error
    vi.spyOn(api, 'put').mockRejectedValue(new Error('mock error'));

    const socketService = new SocketService();
    await socketService.joinRoom('mockRoom', 'mockPlayerName');

    // Assert that the socket is not created
    expect(socketService.socket).toBeUndefined();
  });

  // fail to move a figure due to socket error
  it('should fail to move a figure when the socket send throws an error', async () => {
    const socketService = new SocketService();
    socketService.socket = new WebSocket('ws://mockWebSocketUrl');
    const mockSend = vi.spyOn(socketService.socket, 'send').mockImplementation(() => {
      throw new Error('mock error');
    });
    vi.spyOn(socketService.socket, 'readyState', 'get').mockReturnValue(WebSocket.OPEN);

    const fieldState = 'mockFieldState';
    const moveMessage = {
      // mock move message
      from: new Coordinate(1, 2),
      to: new Coordinate(1, 2),
    };

    try {
      await socketService.move(fieldState, moveMessage);
    } catch (error) {
      // Assert that the socket send method is called with the correct payload
      expect(mockSend).toHaveBeenCalledWith(
        JSON.stringify({
          action: GameAction.moveFigure,
          payload: { fieldState, moveMessage },
        }),
      );

      // Assert that the error is thrown
      expect(error).toBeInstanceOf(Error);
    }
  });
});

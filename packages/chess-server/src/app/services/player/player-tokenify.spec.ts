import jwt from 'jsonwebtoken';
import type { PlayerTokenInfo } from './player-tokenify';
import { buildToken } from './player-tokenify';

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access
require('dotenv').config({ path: 'packages/chess-server/.env' });

describe('buildToken', () => {
  // Returns a string JWT token when given valid PlayerTokenInfo input
  it('should return a string JWT token when given valid PlayerTokenInfo input', () => {
    const info: PlayerTokenInfo = {
      roomName: 'room1',
      playerName: 'player1',
    };
    const token = buildToken(info);
    expect(typeof token).toBe('string');
  });

  // Uses the JWT_SECRET environment variable to sign the token
  it('should use the JWT_SECRET environment variable to sign the token', () => {
    process.env.JWT_SECRET = 'secret';
    const info: PlayerTokenInfo = {
      roomName: 'room1',
      playerName: 'player1',
    };
    const token = buildToken(info);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded).toMatchObject(info);
  });

  // Sets the noTimestamp option to true when signing the token
  it('should set the noTimestamp option to true when signing the token', () => {
    process.env.JWT_SECRET = 'secret';
    const info: PlayerTokenInfo = {
      roomName: 'room1',
      playerName: 'player1',
    };
    const token = buildToken(info);
    const decoded = jwt.decode(token);
    expect(decoded).toEqual(expect.objectContaining({ roomName: 'room1', playerName: 'player1' }));
  });

  // Throws an error when JWT_SECRET environment variable is not defined
  it('should throw an error when JWT_SECRET environment variable is not defined', () => {
    delete process.env.JWT_SECRET;
    const info: PlayerTokenInfo = {
      roomName: 'room1',
      playerName: 'player1',
    };
    expect(() => buildToken(info)).toThrowError();
  });

  // Throws an error when expiresIn option is not a valid time format
  it('should throw an error when expiresIn option is not a valid time format', () => {
    process.env.JWT_SECRET = 'secret';
    process.env.JWT_EXPIRES_IN = 'invalid';
    const info: PlayerTokenInfo = {
      roomName: 'room1',
      playerName: 'player1',
    };
    expect(() => buildToken(info)).toThrowError();
  });
});

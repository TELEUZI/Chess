import jwt from 'jsonwebtoken';

export interface PlayerTokenInfo {
  roomName: string;
  playerName: string;
}

export function buildToken(info: PlayerTokenInfo): string {
  const secret = process.env.JWT_SECRET;
  if (typeof secret !== 'string') {
    throw new Error('Could not find a secret to sign a jwt.');
  }
  return jwt.sign(info, secret, { noTimestamp: true, expiresIn: process.env.JWT_EXPIRES_IN });
}

export function verifyDecodeToken(token: string): PlayerTokenInfo {
  const secret = process.env.JWT_SECRET;
  if (typeof secret !== 'string') {
    throw new Error('Could not find a secret to verify/decode a jwt.');
  }
  return jwt.verify(token, secret) as PlayerTokenInfo;
}

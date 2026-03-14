import jwt, { JwtPayload } from "jsonwebtoken";

import { ReturnToken, TokenPayload } from "./types";
export const ACCESS_TOKEN_SECRET = "access-secret-example";
export const REFRESH_TOKEN_SECRET = "refresh-secret-example";
export const ACCESS_TOKEN_EXPIRES_IN = 60 * 15; // 15 minutes
export const REFRESH_TOKEN_EXPIRES_IN = 60 * 60 * 24; // 1 day

export const tokenUtils = {
  generateToken(payload: TokenPayload, secret: string, expiresIn: number) {
    return jwt.sign(payload, secret, {
      expiresIn: expiresIn,
    });
  },
  generateAccessToken(payload: TokenPayload): ReturnToken {
    const token = this.generateToken(
      payload,
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRES_IN
    );

    return {
      token: token,
      expiresAt: Date.now() + ACCESS_TOKEN_EXPIRES_IN * 1000,
    };
  },
  generateRefreshToken(payload: TokenPayload): ReturnToken {
    const token = this.generateToken(
      payload,
      REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_EXPIRES_IN
    );

    return {
      token,
      expiresAt: Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000,
    };
  },
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return true;
      } else {
        return false;
      }
    } catch (err: unknown) {
      return true;
    }
  },
  verifyAccessToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
      return decoded as TokenPayload;
    } catch (err: unknown) {
      return null;
    }
  },
};

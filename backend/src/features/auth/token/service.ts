import { tokenDatabase } from "./database";
import { TokenPayload } from "./types";
import { tokenUtils } from "./utils";

export const tokenService = {
  generateAccessToken(payload: TokenPayload) {
    return tokenUtils.generateAccessToken(payload);
  },
  generateRefreshToken(payload: TokenPayload) {
    const token = tokenUtils.generateRefreshToken(payload);

    tokenDatabase.insert(payload.login, token.token, token.expiresAt);

    return token;
  },
  isRefreshTokenExist(token: string) {
    const refreshToken = tokenDatabase.select(token);

    if (!refreshToken) {
      return false;
    }

    return true;
  },
  isRefreshTokenExpired(token: string) {
    const refreshSession = tokenDatabase.select(token);

    if (!refreshSession) return true;

    if (tokenUtils.isTokenExpired(token)) {
      return true;
    } else {
      return false;
    }
  },
};

import { tokenDatabase } from "./database";
import { TokenPayload } from "./types";
import { tokenUtils } from "./utils";

export const tokenService = {
  generateAccessToken(payload: TokenPayload) {
    return tokenUtils.generateAccessToken(payload);
  },
  async generateRefreshToken(payload: TokenPayload, userId: number) {
    const token = tokenUtils.generateRefreshToken(payload);

    await tokenDatabase.insert(userId, token.token, token.expiresAt);

    return token;
  },
  isRefreshTokenExist(token: string) {
    const refreshToken = tokenDatabase.selectByToken(token);

    if (!refreshToken) {
      return false;
    }

    return true;
  },
  isRefreshTokenExpired(token: string) {
    const refreshSession = tokenDatabase.selectByToken(token);

    if (!refreshSession) return true;

    if (tokenUtils.isTokenExpired(token)) {
      return true;
    } else {
      return false;
    }
  },
};

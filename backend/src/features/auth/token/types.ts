import { User } from "../user/types";

export interface RefreshSessionDBRow extends Pick<User, "login"> {
  refresh_token: string;
  expires_at: number | null;
}

export type TokenPayload = Pick<User, "login">;

export type ReturnToken = {
  token: string;
  expiresAt: number;
};

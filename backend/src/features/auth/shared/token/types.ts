import { User } from "../user/types";

export interface RefreshSessionDBRow {
  user_id: number;
  refresh_token: string;
  expires_at: number | null;
}

export type TokenPayload = { userId: RefreshSessionDBRow["user_id"] };

export type ReturnToken = {
  token: string;
  expiresAt: number;
};

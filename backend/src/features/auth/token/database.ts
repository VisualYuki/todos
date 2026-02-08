import type { Client } from "pg";
import { client } from "@/core/database";
import { tokenSql } from "./sql";
import { RefreshSessionDBRow } from "./types";

export const tokenDatabase = {
  async insert(login: string, refreshToken: string, expiresAt: number) {
    this.removeByLogin(login);

    await client.query(tokenSql.insert, [login, refreshToken, expiresAt]);
  },
  async removeByLogin(login: string) {
    await client.query(tokenSql.deleteByLogin, [login]);
  },
  async select(token: string) {
    const rawData = await client.query<RefreshSessionDBRow>(tokenSql.select, [
      token,
    ]);

    return rawData.rows[0];
  },
  async removeByToken(refreshToken: string) {
    await client.query(tokenSql.deleteByToken, [refreshToken]);
  },
  async initTokenSchema(client: Client) {
    await client.query(tokenSql.create);
  },
};

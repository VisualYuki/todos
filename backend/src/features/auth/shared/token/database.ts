import type { Client } from "pg";
import { client } from "@/core/database";
import { tokenSql } from "./sql";
import { RefreshSessionDBRow } from "./types";

export const tokenDatabase = {
  async insert(userId: number, refreshToken: string, expiresAt: number) {
    this.removeByUserId(userId);

    await client.query(tokenSql.insert, [userId, refreshToken, expiresAt]);
  },
  async removeByUserId(userId: number) {
    await client.query(tokenSql.deleteByUserId, [userId]);
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
  async deleteAll() {
    await client.query(tokenSql.deleteAll);
  },
};

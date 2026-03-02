import type { Client } from "pg";

import { client } from "@/core/database";
import { userSql } from "./sql";
import { UserDBRow } from "./types";

export const userDatabase = {
  async selectByLogin(login: string) {
    const rawData = await client.query<UserDBRow>(userSql.selectByLogin, [
      login,
    ]);

    return rawData.rows[0];
  },
  async initUserSchema(client: Client) {
    await client.query(userSql.create);
  },
  async insertUser(login: string, password: string) {
    await client.query(userSql.insertUser, [login, password]);
  },
  async deleteUser(login: string) {
    await client.query(userSql.deleteUser, [login]);
  },
};

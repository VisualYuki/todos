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
    const rawData = await client.query<UserDBRow>(userSql.insertUser, [
      login,
      password,
    ]);

    return rawData.rows[0];
  },
  async deleteUser(login: string) {
    await client.query(userSql.deleteUser, [login]);
  },
  async deleteAll() {
    await client.query(userSql.deleteAll);
  },
};

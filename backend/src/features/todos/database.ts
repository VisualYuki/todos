import { todosSql } from "./sql";
import { Client } from "pg";

export const todosDatabase = {
  async initTodosSchema(client: Client) {
    return await client.query(todosSql.create);
  },
};

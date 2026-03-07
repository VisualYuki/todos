import { client } from "@/core/database";
import { todosSql } from "./sql";
import { Client } from "pg";
import { TodosDbRow } from "./types";

export const todosDatabase = {
  async initTodosSchema(client: Client) {
    return await client.query(todosSql.create);
  },
  async selectByUserId(user_id: number) {
    return await client.query(todosSql.select, [user_id]);
  },
  async insert(data: {
    userId: number;
    title: string;
    completed?: boolean;
    description?: string;
  }) {
    const result = await client.query<TodosDbRow>(todosSql.insert, [
      data.userId,
      data.title,
      data.completed || false,
      data.description,
    ]);

    return result.rows[0];
  },
  async deleteAll() {
    return await client.query(todosSql.deleteAll);
  },
};

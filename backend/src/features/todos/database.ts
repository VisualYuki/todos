import { client } from "@/core/database";
import { todosSql } from "./sql";
import { Client } from "pg";
import { TodosDbRow } from "./types";

export const todosDatabase = {
  async initTodosSchema(client: Client) {
    return await client.query(todosSql.create);
  },
  async selectByUserId(userId: number) {
    return (await client.query(todosSql.selectAll, [userId])).rows;
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
  async deleteById(id: number) {
    try {
      const result = await client.query(todosSql.deleteById, [id]);
    } catch {
      return false;
    }

    return true;
  },
  async deleteAll() {
    return await client.query(todosSql.deleteAll);
  },
  async updateTitle(id, title) {
    return (await client.query(todosSql.updateTitle, [title, id])).rows[0];
  },
  async updateDescription(id, description) {
    return (await client.query(todosSql.updateDescription, [description, id]))
      .rows[0];
  },
  async updateCompleted(id, completed) {
    return (await client.query(todosSql.updateCompleted, [completed, id]))
      .rows[0];
  },
};

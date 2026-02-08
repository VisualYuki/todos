import { Client } from "pg";

export let client: Client;

export async function connectToDatabase() {
  client = new Client({
    port: 5432,
    password: "123",
    user: "postgres",
    database: "todos",
  });

  await client.connect();

  return client;
}

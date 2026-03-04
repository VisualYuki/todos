import { Client } from "pg";

export let client: Client;

export async function connectToDatabase(
  dbName: "todos" | "todos-test" = "todos"
) {
  client = new Client({
    port: 5432,
    password: "123",
    user: "postgres",
    database: dbName,
  });

  try {
    await client.connect();
  } catch (err) {
    console.log(err);
  }

  return client;
}

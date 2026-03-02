import { app } from "@/core/express";
import { connectToDatabase, client } from "@/core/database";
import { userRouter } from "@/features/auth";
import { userDatabase } from "@/features/auth/user";
import { tokenDatabase, tokenRouter } from "@/features/auth/token";
import { todosDatabase } from "./features/todos";

app.use(userRouter);
app.use(tokenRouter);

async function main() {
  await connectToDatabase();
  await userDatabase.initUserSchema(client);
  await tokenDatabase.initTokenSchema(client);
  await todosDatabase.initTodosSchema(client);
  app.listen(1865, () => {});
}

main().catch(console.error);

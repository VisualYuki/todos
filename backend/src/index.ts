import { app } from "@/core/express";
import { connectToDatabase, client } from "@/core/database";
import { loginRouter, registrationRouter } from "@/features/auth";
import { userDatabase } from "@/features/auth";
import { tokenDatabase } from "@/features/auth";
import { tokenRouter } from "@/features/auth/index";
import { todosDatabase } from "@/features/todos";
import { todosRouter } from "@/features/todos";

app.use(registrationRouter);
app.use(loginRouter);
app.use(tokenRouter);
app.use(todosRouter);

async function main() {
  await connectToDatabase();
  await userDatabase.initUserSchema(client);
  await tokenDatabase.initTokenSchema(client);
  await todosDatabase.initTodosSchema(client);
  app.listen(1865, () => {});
}

main().catch(console.error);

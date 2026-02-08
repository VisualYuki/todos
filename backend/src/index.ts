import { app } from "@/core/express";
import { connectToDatabase, client } from "@/core/database";
import { userRouter } from "@/features/auth";
import { userDatabase } from "@/features/auth/user";
import { tokenDatabase } from "@/features/auth/token";

app.use(userRouter);

async function main() {
  await connectToDatabase();
  await userDatabase.initUserSchema(client);
  await tokenDatabase.initTokenSchema(client);
  app.listen(1865, () => {});
}

main().catch(console.error);

import { connectToDatabase } from "../src/core/database";
import { hashUtils } from "../src/shared/hash";

async function addUser(login: string, password: string) {
  const client = await connectToDatabase();

  const hashedPassword = await hashUtils.hash(password);

  await client.query("INSERT INTO users (login, password) VALUES ($1, $2)", [
    login,
    hashedPassword,
  ]);

  console.log(`Пользователь ${login} успешно добавлен.`);

  await client.end();
}

const login = process.argv[2];
const password = process.argv[3];

if (!login || !password) {
  console.error(
    "Использование: npx ts-node scripts/add-user.ts <login> <password>"
  );
  process.exit(1);
}

addUser(login, password).catch((err) => {
  console.error(err);
  process.exit(1);
});

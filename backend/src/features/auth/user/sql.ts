export const userSql = {
  create: `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      login TEXT NOT NULL UNIQUE CHECK (length(login) > 0),
      password TEXT NOT NULL CHECK (length(password) > 0)
    )
  `,
  selectByLogin: `
    SELECT * FROM users where $1 = login
  `,
  insertUser: `
    INSERT INTO users (login, password) VALUES ($1, $2)
  `,
  deleteUser: `
    DELETE FROM users WHERE login = $1
  `,
};

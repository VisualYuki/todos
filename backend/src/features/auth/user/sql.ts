export const userSql = {
  create: `
    create table if not exists users (
      login TEXT NOT NULL PRIMARY KEY,
      password TEXT NOT NULL
    )
  `,
  selectByLogin: `
    select * from users where $1 = login
  `,
};

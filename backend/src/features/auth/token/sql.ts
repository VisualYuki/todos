export const tokenSql = {
  create: `
		CREATE TABLE if not exists refresh_sessions (
			"login" TEXT NOT NULL UNIQUE,
			"refresh_token" TEXT NOT NULL,
			"expires_at" INTEGER
		)
	`,
  insert: `
		insert into refresh_sessions (login, refresh_token, expires_at) values ($1, $2, $3)
	`,
  deleteByLogin: `
		delete from refresh_sessions where login = $1
	`,
  deleteByToken: `
		delete from refresh_sessions where refresh_token = $1
	`,
  select: `
		select * from refresh_sessions where refresh_token = $1
	`,
};

export const tokenSql = {
  create: `
		CREATE TABLE IF NOT EXISTS refresh_sessions (
			user_id REFERENCES users, 
			refresh_token TEXT NOT NULL UNIQUE CHECK (length(refresh_token) > 0),
			expires_at TEXT NOT NULL CHECK (expires_at > now())
		)
	`,
  insert: `
		INSERT INTO refresh_sessions (login, refresh_token, expires_at) VALUES ($1, $2, $3)
	`,
  deleteByLogin: `
		DELETE FROM refresh_sessions WHERE login = $1
	`,
  deleteByToken: `
		DELETE FROM refresh_sessions WHERE refresh_token = $1
	`,
  select: `
		SEELCT * FROM refresh_sessions WHERE refresh_token = $1
	`,
};

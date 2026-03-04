export const tokenSql = {
  create: `
		CREATE TABLE IF NOT EXISTS refresh_sessions (
			user_id INTEGER REFERENCES users ON DELETE CASCADE, 
			refresh_token TEXT NOT NULL UNIQUE CHECK (length(refresh_token) > 0),
			expires_at BIGINT NOT NULL
		)
	`,
  insert: `
		INSERT INTO refresh_sessions (user_id, refresh_token, expires_at) VALUES ($1, $2, $3)
	`,
  deleteByUserId: `
		DELETE FROM refresh_sessions WHERE user_id = $1
	`,
  deleteByToken: `
		DELETE FROM refresh_sessions WHERE refresh_token = $1
	`,
  select: `
		SEELCT * FROM refresh_sessions WHERE refresh_token = $1
	`,
  deleteAll: `
		DELETE FROM refresh_sessions;
 	`,
};

export const todosSql = {
  create: `
		CREATE TABLE IF NOT EXISTS todos (
			id SERIAL PRIMARY KEY,
			user_id INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
			title TEXT NOT NULL CHECK (length(title) > 0),
			description TEXT, 
			completed BOOLEAN DEFAULT false,
			created_at TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP
		)
	`,
  insert: `
		INSERT INTO todos (user_id, title, completed, description) VALUES ($1, $2, $3, $4) RETURNING *
	`,
  deleteById: `
		DELETE FROM todos WHERE id = $1
	`,
  //   deleteByUserId: `
  // 		DELETE FROM todos WHERE user_id = $1
  // 	`,
  select: `
		SELECT * FROM todos WHERE user_id = $1;
	`,
  deleteAll: `
		DELETE * from todos;
	`,
};

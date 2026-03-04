export const todosSql = {
  create: `
		CREATE TABLE IF NOT EXISTS todos (
			id SERIAL PRIMARY KEY,
			user_id NOT NULL REFERENCES users,
			title TEXT NOT NULL CHECK (length(title) > 0),
			description TEXT, 
			created_at TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP
		)
	`,
  insert: `
		INSERT INTO todos (user_id, title, description) VALUES ($1, $2, $3)
	`,
  deleteById: `
		DELETE FROM todos WHERE id = $1
	`,
  //   deleteByUserId: `
  // 		DELETE FROM todos WHERE user_id = $1
  // 	`,
  select: `
		SELECT * FROM todos;
	`,
};

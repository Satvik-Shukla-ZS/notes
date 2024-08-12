const sqlite3 = require('sqlite3').verbose();

interface User {
}

const ErrorType : Record<string, string> = {
    "SQLITE_CONSTRAINT: UNIQUE constraint failed: User.email" : "Email already exists",
}

class CollectionDatabase {
    private static db: any;

    static {
        this.db = new sqlite3.Database('database.db', (err: Error | null) => {
            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                console.log('Connected to the SQLite database.');
                this.db.run(`CREATE TABLE IF NOT EXISTS Collection (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    content TEXT,
                    isDeleted BOOLEAN DEFAULT FALSE,
                    userRef INTEGER REFERENCES User (id)
                )`, (err: Error | null) => {
                    if (err) {
                        console.error('Error creating table:', err.message);
                    }
                });
            }
        });
    }
}

export default CollectionDatabase;

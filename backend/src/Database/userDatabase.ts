const sqlite3 = require('sqlite3').verbose();

interface User {
}

const ErrorType : Record<string, string> = {
    "SQLITE_CONSTRAINT: UNIQUE constraint failed: User.email" : "Email already exists",
}

class UserDatabase {
    private static db: any;

    static {
        this.db = new sqlite3.Database('database.db');
    }
}

export default UserDatabase;

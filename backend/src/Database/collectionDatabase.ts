const sqlite3 = require('sqlite3').verbose();

export interface Collection {
    id: number;
    name : string,
    content : string
}

const ErrorType : Record<string, string> = {
    "SQLITE_CONSTRAINT: UNIQUE constraint failed: User.email" : "Email already exists",
}

class CollectionDatabase {
    private static db: any;

    static {
        this.db = new sqlite3.Database('database.db', async (err: Error | null) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                console.log('[ COLLECTION ] : Connected to the SQLite database.');

                await new Promise(resolve => setTimeout(resolve, 500));

                this.db.run(`CREATE TABLE IF NOT EXISTS Collection (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT,
                            isDeleted BOOLEAN DEFAULT FALSE,
                            userRef INTEGER,
                            parent INTEGER,
                            FOREIGN KEY (userRef) REFERENCES User (id),
                            FOREIGN KEY (parent) REFERENCES Collection (id)
                        );`, (err: Error | null) => {
                    if (err) {
                        console.error('Error creating table:', err.message);
                    }
                });

                await new Promise(resolve => setTimeout(resolve, 500));

                this.db.run(`
                            CREATE TRIGGER IF NOT EXISTS check_parent_user_update
                            BEFORE UPDATE ON Collection
                            FOR EACH ROW
                            BEGIN
                                -- Ensure that if the parent is changed, it still belongs to the same user
                                SELECT
                                CASE
                                    WHEN (NEW.parent IS NOT NULL AND
                                          (SELECT userRef FROM Collection WHERE id = NEW.parent) != NEW.userRef) THEN
                                        RAISE (ABORT, 'Parent collection does not belong to the same user')
                                END;
                            END;
                            `, (err:Error) => {

                    if (err) {
                        console.error('Error enabling foreign keys : [ COLLECTION ] : TRIGGER ', err.message);
                    }
                });

                await new Promise(resolve => setTimeout(resolve, 500));

                this.db.run('PRAGMA foreign_keys = ON;', (err:Error) => {
                    if (err) {
                        console.error('Error enabling foreign keys : [ COLLECTION ] : ', err.message);
                    }
                });
            }
        });
    }

    static async addCollection(name : string,userId:number,parent:string|null = null): Promise<Collection | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise(async (resolve, reject) => {
            this.db.run('INSERT INTO Collection (name,userRef,parent) VALUES (?, ?, ?)', [name,userId, parent ? Number(parent) : null], async function (err: Error | null) {
                if (err) {
                    if(err.message in ErrorType){
                        reject(ErrorType[err.message]);
                    }else{
                        reject();
                    }
                } else {
                    // @ts-ignore
                    const lastId = this.lastID;

                    const collection = await CollectionDatabase.findCollectionById(lastId,userId).catch(()=>null)
                    if(!collection) return reject();

                    resolve(collection);
                }
            });
        });
    }

    static async findCollectionById(collectionId : number,userId:number): Promise<Collection | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<Collection | null>((resolve, reject) => {
            this.db.get('SELECT * FROM Collection WHERE id = ? AND userRef = ?', [collectionId,userId], (err: Error | null, row: Collection | undefined) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(row || null);
                }
            });
        });
    }

    static async findCollectionByUser(userId : number): Promise<Collection | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<Collection | null>((resolve, reject) => {
            this.db.get('SELECT * FROM Collection WHERE userRef = ?', [userId], (err: Error | null, row: Collection | undefined) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(row || null);
                }
            });
        });
    }

    static async findCollectionByUserAndRoot(userId : number,parent:number|null): Promise<Collection[] | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<Collection[] | null>((resolve, reject) => {
            let query = 'SELECT * FROM Collection WHERE userRef = ? AND isDeleted = 0';
            let params = [userId];

            if (parent === null) {
                query += ' AND parent IS NULL';
            } else {
                query += ' AND parent = ?';
                params.push(parent);
            }

            this.db.all(query, params, (err: Error | null, row: Collection[] | undefined) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(row || null);
                }
            });
        });
    }
}

export default CollectionDatabase;

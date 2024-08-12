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
        this.db = new sqlite3.Database('database.db', (err: Error | null) => {
            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                console.log('Connected to the SQLite database.');

                this.db.run('PRAGMA foreign_keys = ON;', (err:Error) => {
                    if (err) {
                        console.error('Error enabling foreign keys:', err.message);
                    }
                });

                this.db.run(`
                            CREATE TRIGGER check_parent_user_update
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
                                console.error('Error enabling foreign keys:', err.message);
                            }
                        });


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
            }
        });
    }

    static async addCollection(name : string,userId:number,parent:string|null = null): Promise<Collection | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise(async (resolve, reject) => {
            this.db.run('INSERT INTO Collection (name,userRef,parent) VALUES (?, ?, ?)', [name,userId, parent ? Number(parent) : null], async function (err: Error | null) {
                if (err) {
                    if(err.message in ErrorType){
                        console.error('Error inserting data:', ErrorType[err.message]);
                        reject(ErrorType[err.message]);
                    }else{
                        console.error('Error inserting data:', err.message);
                        reject();
                    }
                } else {
                    console.log('Data inserted successfully.');
                    // @ts-ignore
                    const lastId = this.lastID;

                    const collection = await CollectionDatabase.findCollectionById(lastId).catch(()=>null)
                    if(!collection) return reject();

                    resolve(collection);
                }
            });
        });
    }

    static async findCollectionById(collectionId : number): Promise<Collection | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<Collection | null>((resolve, reject) => {
            this.db.get('SELECT * FROM Collection WHERE id = ?', [collectionId], (err: Error | null, row: Collection | undefined) => {
                if (err) {
                    console.error('Error finding Collection :', ErrorType[err.message]);
                    reject(null);
                } else {
                    resolve(row || null);
                }
            });
        });
    }
}

export default CollectionDatabase;

const sqlite3 = require('sqlite3').verbose();

interface Page {
    id : number,
    name : string ,
    content : string ,
    isDeleted : 0 | 1 ,
    collectionRef : number ,
}

const ErrorType : Record<string, string> = {
    "SQLITE_CONSTRAINT: UNIQUE constraint failed: User.email" : "Email already exists",
}

class PageDatabase {
    private static db: any;

    static {
        this.db = new sqlite3.Database('database.db', async (err: Error | null) => {
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                console.log('[ PAGE ] : Connected to the SQLite database.');

                await new Promise(resolve => setTimeout(resolve, 500));

                this.db.run('PRAGMA foreign_keys = ON;', (err:Error) => {
                    if (err) {
                        console.error('Error enabling foreign keys : [ PAGE ] : ', err.message);
                    }
                });

                await new Promise(resolve => setTimeout(resolve, 500));

                this.db.run(`CREATE TABLE IF NOT EXISTS Page (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    content TEXT,
                    isDeleted BOOLEAN DEFAULT FALSE,
                    userRef INTEGER NOT NULL,
                    collectionRef INTEGER NOT NULL,
                    FOREIGN KEY (collectionRef) REFERENCES Collection (id),
                    FOREIGN KEY (userRef) REFERENCES User (id)
                )`, (err: Error | null) => {
                    if (err) {
                        console.error('Error creating table:', err.message);
                    }
                });

                await new Promise(resolve => setTimeout(resolve, 500));
            }
        });
    }

    static async createPage(name : string,collectionRef:number,userId:number): Promise<Page | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise(async (resolve, reject) => {
            this.db.run('INSERT INTO Page (name,collectionRef,userRef) VALUES (?, ? , ?)', [name,collectionRef,userId], async function (err: Error | null) {
                if (err) {
                    if(err.message in ErrorType){
                        reject(ErrorType[err.message]);
                    }else{
                        reject();
                    }
                } else {
                    // @ts-ignore
                    const lastId = this.lastID;

                    const page = await PageDatabase.findPageById(lastId,userId).catch(()=>null)
                    if(!page) return reject();

                    resolve(page);
                }
            });
        });
    }

    static async savePage(pageId : number,content:string,userId:number): Promise<true | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise(async (resolve, reject) => {
            this.db.run('UPDATE Page SET content = ? WHERE id = ? AND userRed = ?', [content,pageId,userId], async function (err: Error | null) {
                if (err) {
                    console.log(err)
                    if(err.message in ErrorType){
                        reject(ErrorType[err.message]);
                    }else{
                        reject();
                    }
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async findPageById(pageId : number , userId : number): Promise<Page | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<Page | null>((resolve, reject) => {
            this.db.get('SELECT * FROM Page WHERE id = ? AND userRef = ?', [pageId , userId], (err: Error | null, row: Page | undefined) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(row || null);
                }
            });
        });
    }

    static async findByCollectionId(collectionId : number , userId : number): Promise<Page[] | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<Page[] | null>((resolve, reject) => {
            this.db.all('SELECT * FROM Page WHERE collectionRef = ? AND userRef = ?', [collectionId,userId], (err: Error | null, row: Page[] | undefined) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(row || null);
                }
            });
        });
    }
}

export default PageDatabase;

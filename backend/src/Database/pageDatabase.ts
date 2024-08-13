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
        this.db = new sqlite3.Database('database.db', (err: Error | null) => {
            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                console.log('Connected to the SQLite database.');
                this.db.run(`CREATE TABLE IF NOT EXISTS Page (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    content TEXT,
                    isDeleted BOOLEAN DEFAULT FALSE,
                    collectionRef INTEGER REFERENCES Collection (id) NOT NULL
                )`, (err: Error | null) => {
                    if (err) {
                        console.error('Error creating table:', err.message);
                    }
                });
            }
        });
    }

    static async createPage(name : string,collectionRef:number): Promise<Page | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise(async (resolve, reject) => {
            this.db.run('INSERT INTO Page (name,collectionRef) VALUES (?, ?)', [name,collectionRef], async function (err: Error | null) {
                if (err) {
                    if(err.message in ErrorType){
                        reject(ErrorType[err.message]);
                    }else{
                        reject();
                    }
                } else {
                    // @ts-ignore
                    const lastId = this.lastID;

                    const page = await PageDatabase.findPageById(lastId).catch(()=>null)
                    if(!page) return reject();

                    resolve(page);
                }
            });
        });
    }

    static async savePage(pageId : number,content:string): Promise<true | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise(async (resolve, reject) => {
            this.db.run('UPDATE Page SET content = ? WHERE id = ?', [content,pageId], async function (err: Error | null) {
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

    static async findPageById(pageId : number): Promise<Page | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<Page | null>((resolve, reject) => {
            this.db.get('SELECT * FROM Page WHERE id = ?', [pageId], (err: Error | null, row: Page | undefined) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(row || null);
                }
            });
        });
    }

    static async findByCollectionId(collectionId : number): Promise<Page[] | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<Page[] | null>((resolve, reject) => {
            this.db.all('SELECT * FROM Page WHERE collectionRef = ?', [collectionId], (err: Error | null, row: Page[] | undefined) => {
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

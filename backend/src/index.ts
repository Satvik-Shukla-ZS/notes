import app from './app';
import { Request, Response } from 'express';

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0" ,() => {
    console.log(`Server is running on port ${PORT}`);
});

app.use((req: Request, res: Response) => {
    res.status(404).send('Page not found');
});

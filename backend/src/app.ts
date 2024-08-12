import express, { Application } from 'express';
import userRoutes from "./routes/userRoutes";
import cors from "cors"

const app: Application = express();

app.use(cors({}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/user', userRoutes);

export default app;

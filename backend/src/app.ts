import express, { Application } from 'express';
import userRoutes from "./routes/userRoutes";
import cors from "cors"
import {headerAuthVerify} from "./helper/Auth";
import responseHandler from "./Handler/responseHandler";

const app: Application = express();

app.use(cors({}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/auth",async (req,res,next)=>{
    if(! await headerAuthVerify(req)) return res.json(responseHandler.UNAUTHORISED("Not authorised"));
    next();
})

app.use('/auth/user', userRoutes);

export default app;

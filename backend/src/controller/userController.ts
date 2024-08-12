import {NextFunction , Request , Response} from "express";
import {headerAuthVerify} from "../helper/Auth";
import responseHandler from "../Handler/responseHandler";
import UserDatabase from "../Database/userDatabase";

class UserController {
    async getProfile (req: Request, res: Response , next: NextFunction){
        const data = await headerAuthVerify(req);
        if(typeof data === "boolean") return res.json(responseHandler.UNAUTHORISED("Not authorised"))

        const db = UserDatabase
        await db.addUser(data.email,data.name).catch((res)=>res)

        const response = await db.findUser(data.email).catch((err:string)=>err)

        if(!response || typeof response === "string") return res.json(responseHandler.NOT_FOUND_ERR("Not Found"))

        return res.json({
            email: data.email,
            profile : data.picture,
            name : data.name,
            id : response.id
        });
    }
}

export default new UserController();

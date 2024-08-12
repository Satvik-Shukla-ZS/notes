import {NextFunction , Request , Response} from "express";
import {headerAuthVerify} from "../helper/Auth";
import {reqBodyValidator} from "../Handler/propType";
import CollectionDatabase from "../Database/collectionDatabase";
import responseHandler from "../Handler/responseHandler";
import UserDatabase from "../Database/userDatabase";

class CollectionController {
    async addCollection (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["name"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { name , parent} = request.body
        const db = CollectionDatabase

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const result = await db.addCollection(name,userObj.id,parent).catch(()=>null)
        if(!result) return res.json(responseHandler.CONFLICT("Collection not created"))

        return res.json(responseHandler.SUCCESS(result))

    }
}

export default new CollectionController();

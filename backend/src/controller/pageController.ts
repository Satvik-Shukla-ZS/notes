import {NextFunction , Request , Response} from "express";
import {headerAuthVerify} from "../helper/Auth";
import {reqBodyValidator} from "../Handler/propType";
import CollectionDatabase from "../Database/collectionDatabase";
import responseHandler from "../Handler/responseHandler";
import UserDatabase from "../Database/userDatabase";
import pageDatabase from "../Database/pageDatabase";
import Database from "../Database";

class PageController {
    async addPage (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["name","collectionId"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { name , collectionId} = request.body

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const result = await Database.PagesDatabase.createPage(name,Number(collectionId),userObj.id).catch((res : string | null)=>res)
        if(!result) return res.json(responseHandler.CONFLICT("Page not created"))
        if(typeof result === "string") return res.json(responseHandler.CONFLICT(result))

        return res.json(responseHandler.SUCCESS(result))

    }

    async savePage (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["id","content"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { id , content} = request.body

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const result = await Database.PagesDatabase.savePage(Number(id),content,userObj.id).catch(()=>null)
        if(!result) return res.json(responseHandler.CONFLICT("Collection not created"))

        return res.json(responseHandler.SUCCESS("Page saved"))

    }

    async getByParent (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["parent"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { parent} = req.body

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const result = await Database.CollectionDatabase.findCollectionByUserAndRoot(userObj.id,parent ? Number(parent) : null).catch(()=>null)
        if(!result) return res.json(responseHandler.CONFLICT("Collection not created"))
        return res.json(responseHandler.SUCCESS(result))
    }
}

export default new PageController();

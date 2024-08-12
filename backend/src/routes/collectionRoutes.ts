import { Router } from 'express';
import collectionController from "../controller/collectionController";
const router = Router();

router.post('/add', collectionController.addCollection);

export default router;
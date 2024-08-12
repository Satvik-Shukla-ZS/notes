import { Router } from 'express';
import userController from "../controller/userController";
const router = Router();

router.post('/profile', userController.getProfile);

export default router;

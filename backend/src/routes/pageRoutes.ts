import { Router } from 'express';
import pageController from "../controller/pageController";
const router = Router();

router.post('/add', pageController.addPage);
router.post('/save', pageController.savePage);

export default router;
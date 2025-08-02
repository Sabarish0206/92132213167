import express from 'express';
import { shortenUrl, redirectUrl, getAllShortUrls } from '../controllers/shortenerController.js';

const router = express.Router();

router.post('/', shortenUrl);
router.get('/all', getAllShortUrls);
router.get('/:shortCode', redirectUrl);

export default router;

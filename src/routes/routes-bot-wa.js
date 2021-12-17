import express from 'express';
import { botWa } from '../controllers/index.js';
import { naru } from '../controllers/index.js';
import { upload } from '../utils/multer-upload.js';
const router = express.Router();

router.get('/', botWa.indexPage);
router.post('/upload-photo', upload.single('file'), botWa.uploadPhoto);
router.get('/image/:file', botWa.downloadFile)
router.get('/naru', naru.getPiket);
router.get('/send-naru', naru.sendPiket);

export default router;

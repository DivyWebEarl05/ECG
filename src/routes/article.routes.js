import express from 'express';
import { 
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle
} from '../controller/article.Controller.js';
import { AppAdminprotect } from '../middleware/authMiddleware.js';
import articleupload  from '../middleware/articlemulter.js'

const router = express.Router();

router.post('/create',articleupload.single('photo'), AppAdminprotect, createArticle);
router.get('/getall', AppAdminprotect, getAllArticles);
router.get('/getById/:id', AppAdminprotect, getArticleById);
router.put('/update/:id', articleupload.single('photo'), AppAdminprotect, updateArticle)
router.delete('/delete/:id', AppAdminprotect, deleteArticle);

export default router;
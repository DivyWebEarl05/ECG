import express from 'express';
import {
    createTermsCondition,
    getAllTermsCondition,
    getTermsConditionById,
    updateTermsCondition,
    deleteTermsCondition
} from '../controller/termsCondition.Controller.js';
import { AppAdminprotect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.post('/create', AppAdminprotect, createTermsCondition);
router.get('/getAll', AppAdminprotect, getAllTermsCondition);
router.get('/getById/:id', AppAdminprotect, getTermsConditionById );
router.put('/update/:id', AppAdminprotect, updateTermsCondition);
router.delete('/delete/:id', AppAdminprotect, deleteTermsCondition);

export default router;
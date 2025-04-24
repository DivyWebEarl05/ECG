import express from 'express';
import {
    createPrivacyPolicy,
    getAllPrivacyPolicy,
    getPrivacyPolicyById,
    updatePrivacyPolicy,
    deletePrivacyPolicy
} from '../controller/privacyPolicy.Controller.js';
import { AppAdminprotect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.post('/create', AppAdminprotect, createPrivacyPolicy);
router.get('/getAll', AppAdminprotect, getAllPrivacyPolicy);
router.get('/getById/:id', AppAdminprotect, getPrivacyPolicyById );
router.put('/update/:id', AppAdminprotect, updatePrivacyPolicy);
router.delete('/delete/:id', AppAdminprotect, deletePrivacyPolicy);

export default router;
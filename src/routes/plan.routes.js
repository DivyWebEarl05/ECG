import express from 'express';
import {
    createPlan, 
    getAllPlans, 
    updatePlan, 
    getPlanById, 
    deletePlan 
} from '../controller/plan.Controller.js';
import planupload from '../middleware/planmulter.js';
import { AppAdminprotect } from '../middleware/authMiddleware.js'
const router = express.Router();

router.post('/add', planupload.single('photo'), AppAdminprotect, createPlan);
router.get('/getAllPlan', AppAdminprotect, getAllPlans);
router.get('/getById/:id', AppAdminprotect, getPlanById);
router.put('/update/:id', planupload.single('photo'), AppAdminprotect, updatePlan);
router.delete('/delete/:id', AppAdminprotect, deletePlan);

export default router;
import express  from "express";
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';
import { createCategoryController } from './../controllers/categoryController.js';

const router= express.Router();

//routes
router.post('/createcategory', 
requireSignIn, isAdmin, 
createCategoryController)

export default router;

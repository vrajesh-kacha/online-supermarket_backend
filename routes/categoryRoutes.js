import express from 'express'
import { createCategoryController, deleteCategoryController, getCategoryController, updateCategoryController } from '../controller/categorycontroller.js';
import { isAdmin } from '../controller/usercontroller.js';
import { verifyToken } from '../middelware/verifyToken.js';

const router=express.Router()


router.post("/create-category",verifyToken,isAdmin,createCategoryController)
router.put("/update-category/:id",verifyToken,isAdmin,updateCategoryController)
router.get("/get-categories",getCategoryController)
router.delete("/delete-category/:id",verifyToken,isAdmin,deleteCategoryController)


export default router;
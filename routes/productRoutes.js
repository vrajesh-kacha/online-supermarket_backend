import express from 'express'
import {checkout, createProductController, deleteProductController, filterProductController, getAllProductController, getKey, paymentVerification, updateProductController } from '../controller/productController.js';
import { verifyToken } from '../middelware/verifyToken.js';
import { isAdmin } from '../controller/usercontroller.js';
import { upload } from '../middelware/multermiddelware.js';
const router=express.Router()

router.post("/create-product",verifyToken,isAdmin,upload.fields([
    {
        name:"image",
        maxCount:1
    },
]),createProductController);
router.get("/get-products",getAllProductController);
router.patch("/update-product/:pid",verifyToken,isAdmin, 
    upload.fields([
        {
            name:"image",
            maxCount:1
        },
    ]),updateProductController)
router.delete("/delete-product/:pid",verifyToken,isAdmin,deleteProductController)
router.post("/filter-product",filterProductController)
router.post("/checkout",verifyToken,checkout)
router.get("/getkey",verifyToken,getKey)
router.post("/payment",paymentVerification)




export default router;


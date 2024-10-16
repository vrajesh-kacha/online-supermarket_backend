import express from "express";
import {
  addtoCart,
  deleteCart,
  isAdmin,
  login,
  register,
  test,getCart,
  updateProfile
} from "../controller/usercontroller.js";
import { verifyToken } from "../middelware/verifyToken.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/test", verifyToken, isAdmin, test);
router.get("/user-auth", verifyToken, (req, res) => {
  return res.status(200).json({
    success: true
  });
});
router.post("/add-cart",verifyToken,addtoCart);
router.delete("/delete-cart",verifyToken,deleteCart)
router.post("/get-cart",verifyToken,getCart);
router.put("/updateprofile",updateProfile);

router.get("/admin-auth", verifyToken, isAdmin,(req, res) => {
  return res.status(200).json({
    success: true
  });
});

export default router;

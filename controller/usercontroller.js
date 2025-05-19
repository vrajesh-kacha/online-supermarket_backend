import { hashPassword, comparepassword } from "../helper/hashpassword.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  try {
    const { email } = req.body;
    const existinguser = await userModel.find({ email });
    if (existinguser.length) {
      return res.status(400).send({
        success: false,
        message: "user already registerd please login!",
      });
    }
    req.body.password = await hashPassword(req.body.password);
    const user = await userModel.create(req.body);
    return res.status(200).send({
      success: true,
      message: "User registered successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error:error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user || !(await comparepassword(req.body.password, user.password))) {
      return res.status(400).send({
        success: false,
        message: "Invalid username or password",
      });
    }
    const { _id, username, phone, role } = user;
    const token = jwt.sign(
      { _id, username, phone, role },
      process.env.JWT_SECRET,
      {
        expiresIn: 30000,
      }
    );
    return res.status(200).send({
      success: true,
      message: "User login successfully",
      user: {
        name: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access",
      });
    }
    next();
  } catch (error) {
    return res.status(403).send({
      success: false,
      message: error,
    });
  }
};
export const test = (req, res) => {
  return res.send({ massage: "protected route" });
};

export const addtoCart = async (req, res) => {
  try {
    await userModel.findOneAndUpdate(
      { email: req.body.email },
      {
        $addToSet: { cart: req.body.id },
      }
    );

    return res.status(200).send({
      success: true,
      message: "product added to cart",
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile=async (req,res)=>{
  try {
  const {name,password,phone,cart}= req.body
  const user= await userModel.find({email:req.body.user.email})
  const updatedUser= await userModel.findOneAndUpdate({email:req.body.user.email},{
      $set:{
        username:name || user.name,
        password:password ?  await hashPassword(password) : user.password,
        phone:phone || user.phone,
      }
  },{new:true})
return res.status(200).send({
  success:true,
  message:"profile updated successfully",
  user: {
    name: updatedUser.username,
    email: updatedUser.email,
    phone: updatedUser.phone,
    role: updatedUser.role,
  }
})
  } catch (error) {
    return res.status(400).send({
      success: false, 
      message: error.message,
    })
  }
}
export const deleteCart = async (req, res) => {
  try {
    await userModel.findOneAndUpdate(
      { email: req.body.email },
      {
        $pull: { cart: req.body.id },
      }
    );

    return res.status(200).send({
      success: true,
      message: "product deleted from cart",
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await userModel.aggregate([
      {
        $match: { email: req.body.email },
      },
      {
        $lookup: {
          from: "products",
          localField: "cart",
          foreignField: "_id",
          as: "cartItems",
        },
      },
      { $project: { cartItems: 1 } },
    ]);
    
    return res.status(200).send({
      success: true,
      cart:cart[0].cartItems
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};

export const deleteAllCart=async(req,res)=>{
  try{
    await userModel.findOneAndUpdate({email:req.body.email},{
      $set:{
      cart:[]
      }
  })
return res.status(200).send({
  success:true,
  message:"All cart deleted succesfully",
})
  } catch (error) {
    return res.status(400).send({
      success: false, 
      message: error.message,
    })
  }

}
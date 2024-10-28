import { razorpay } from "../index.js";
import productModel from "../models/productModel.js";
import { uploadOnCloudinary } from "./filehandling.js";
import fs from "fs";
import crypto from 'crypto'

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.body;
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
    }
    if (!req.files.image) {
      return res.status(400).json({
        message: "product image is required",
      });
    } 
    const imageBuffer = req.files.image[0].buffer
    const productImage = await uploadOnCloudinary(imageBuffer);
    const product = await productModel.create({
      name,
      description,
      price,
      category,
      quantity,
      photo: productImage.url,
    });
  
    return res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in creating product",
    });
  }
};

export const getAllProductController = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "All Products retrive succesfully",
      products,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid);
    return res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (category) updateData.category = category;
    if (quantity) updateData.quantity = quantity;

    if (req.files && req.files.image && req.files.image.length > 0) {
      const imageBuffer = req.files.image[0].buffer;
      const productImage = await uploadOnCloudinary(imageBuffer);
      updateData.photo = productImage.url;
    }
    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      updateData,
      { new: true }
    );
    return res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: "Error in Update product",
    });
  }
};

export const filterProductController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    const filter = {};
    if (checked && checked.length > 0) filter.category = { $in: checked };
    if (radio && radio.length > 0)
      filter.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(filter);

    return res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

export const checkout = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).send({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(200).send({
      success: false,
      error,
    });
  }
};

export const getKey = async (req, res) => {
  try {
    return res.status(200).send({
      success: true,
      key: process.env.RAZORPAY_API_ID,
    });
  } catch (error) {
    return res.status(200).send({
      success: false,
      error,
    });
  }
};

export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");


    if (expectedSignature === razorpay_signature) {

   return res.redirect(
        `http://localhost:5173/dashboard/paymentsuccess`
      );
    } 
    else {
    return  res.status(400).send({
        success: false,
      });
    }
  } catch (error) {
    return res.status(200).send({
      success: false,
      error,
    });
  }
};

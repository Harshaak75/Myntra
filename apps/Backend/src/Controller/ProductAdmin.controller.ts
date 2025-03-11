import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { approve_product, delete_product, getSellerdata, login_productAdmin } from "../Services/ProductAdmin.services";

export const login_product_admin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const data = req.body;

    const productAdmin_login = await login_productAdmin(data);

    return res.status(200).json({
      message: "Logged In Successfully",
      token: productAdmin_login.productAdmin_token.accessToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error: error in login product admin", error: error });
  }
};


export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> =>{
  try {
    const productId  = req.params;

    console.log(productId.id)

    if(!productId){
      return res.status(400).json({message: "Product id is required"})
    }

    const deletedProduct = await delete_product(productId.id);

    if(!deletedProduct){
      return res.status(400).json({message: "Product not found"})
    }
    return res.status(200).json({message: "Product deleted successfully"})
  } catch (error: any) {
    return res.status(500).json({message: "Error deleting product", error})
  }
}

export const getSellerDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const seller_details =await getSellerdata(); 

    if(!seller_details){
      return res.status(400).json({message: "Seller data not found"})
    }

    return res.status(200).json({message: "Seller data", seller_details})
  } catch (error) {
    return res.status(500).json({message: "Error getting seller data", error})
  }
}

export const aproveProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> =>{
  try {
    const product_id = req.params.id;

    const {approve} = req.body;

    if(typeof approve !== "boolean"){
      return res.status(400).json({message: "Approve must be a boolean"})
    }

    if(!product_id){
      return res.status(400).json({message: "Product id is required"})
    }

    const product = await approve_product(product_id, approve);

    if(!product){
      return res.status(400).json({message: "Product not found"})
    }

    return res.status(200).json({message: "Product approved successfully"})
  } catch (error) {
    return res.status(500).json({message: "Error approving product", error})
  }
}
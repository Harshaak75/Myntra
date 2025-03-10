import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { salt_rounds, secure_cookie, seller_serect } from "../config";
import { add_product, Create_Seller_account, editProduct } from "../Services/seller.services";
import { generateTokensSeller } from "../utils/tokenUtils";
import jwt, { JwtPayload } from "jsonwebtoken";

const Client = new PrismaClient();

export const register_seller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const new_seller_data = req.body;

    const existing_seller = await Client.seller.findUnique({
      where: { email: new_seller_data.email },
    });

    if (existing_seller)
      return res.status(400).json({ message: "Seller already exists" });

    const hashedPassword = await bcrypt.hash(
      new_seller_data.password,
      Number(salt_rounds)
    );

    const seller_account = await Create_Seller_account(
      new_seller_data,
      hashedPassword
    );

    res.cookie("sell_access_token", seller_account, {
      httpOnly: true,
      sameSite: "none",
      secure: secure_cookie === "Production",
      maxAge: 5 * 60 * 1000,
    });

    // console.log("token in controller: ",seller_account);

    res.status(200).json({message: "the seller account was created", sellerToken: seller_account})
  } catch (error) {
    res.status(500).json({ message: "Error registering seller", error });
  }
};


export const login_seller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> =>{
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  

  try {
    const seller_data = req.body;

    const existing_seller = await Client.seller.findUnique({
      where: { email: seller_data.email },
    });

    if(!existing_seller) return res.status(400).json({message: "Seller does not exist"});

    bcrypt.compare(seller_data.password, existing_seller.password, async (err, result) =>{
      if(err) return res.status(400).json({message: "Invalid credentials"});
      
      if(result) {
        const seller_account = await generateTokensSeller(existing_seller.id);

        // console.log("seller_contoller: ",seller_account)

        res.cookie("sell_access_token", seller_account, {
          httpOnly: true,
          sameSite: "none",
          secure: secure_cookie === "Production",
          maxAge: 5 * 60 * 1000,
        })

        res.status(200).json({message: "Seller logged in successfully", sellerToken: seller_account})
      }
      else{
        return res.status(400).json({message: "Invalid credentials"});
      }
    })
    
  } catch (error) {
    res.status(500).json({ message: "Error logging seller in", error });
  }
}

export const SellerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> =>{
  try {
    const seller_token = req.headers["authorization"]?.split(" ")[1] || req.cookies.sell_access_token

    // console.log(seller_id)

    if(!seller_token){
      return res.status(401).json({message: "Unauthorized"});
    }

    if (!seller_serect) {
      throw new Error("JWT secret is missing!"); // Ensure it's defined
    }

    const decoded = jwt.verify(seller_token, seller_serect) as JwtPayload

    const seller_profile = await Client.seller.findUnique({where: {id: decoded.id}})

    if(!seller_profile){
      return res.status(404).json({message: "Seller not found"});
    }

    const {password, ...sellerprofile} = seller_profile;
    
    res.status(200).json({message: "Seller profile", sellerprofile})
  } catch (error: any) {
    res.status(500).json({message: "The error in seller profile ", error})
  }
}

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> =>{
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product_data = req.body;

    const seller_Id = req.seller_id;

    console.log(seller_Id)

    if(!seller_Id){
      return res.status(401).json({message: "Unauthorized"})
    }

    const product = await add_product(product_data, seller_Id);

    res.status(200).json({message: "The product was added successfully", product})

  } catch (error) {
    res.status(500).json({message: "Error adding product", error})
  }
}


export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any>=> {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const edit_product = req.body;

    const product_id = req.params.id;

    // console.log(product_id)

    if(!product_id){
      return res.status(400).json({message: "Product id is required"})
    }

    const product = await editProduct(edit_product, product_id);
    res.status(200).json({message: "The product was updated successfully", product})
  } catch (error) {
    res.status(500).json({message: "Error updating product"})
  }

}
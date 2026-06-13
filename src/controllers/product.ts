import mongoose from "mongoose";
import { productModel, type Iproduct } from "../models/productModel.js";
import type { Request, Response } from "express";



export const getAllproducts = async(req:Request,res:Response): Promise<void> =>{

    try {
         const Allproducts = await productModel.find();

    if(Allproducts.length === 0){
        res.status(400).json({
            message:"No products found You should add some products first !"
        })
        return; // 🎯 دي اللي هتحمي السيرفر إنه يكمل تحت لو المصفوفة فاضية
    }

    res.status(200).json({
            success: true,
            message: "Success",
            count: Allproducts.length,
            products: Allproducts 
        });


    } catch (error) {

        res.status(500).send(`Internal server : ${error} `);
        
    }

}
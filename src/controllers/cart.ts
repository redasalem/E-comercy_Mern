import { cartModel } from "../models/cartModel.js";

interface CreateCartForUser{
    userId:string;
}


const createCartForUser= async({userId}:CreateCartForUser)=>{

    const cart = await cartModel.create({userId,totalAmount:0})

    await cart.save();

    return cart;

}

interface GetActiveCartForUser{
    userId:string;
}

export const getActiveCartForUser = async({userId}:GetActiveCartForUser)=>{

    const cart = await cartModel.findOne({userId});

    if(!cart){
        const cart = await createCartForUser({userId});
    }

    return cart;

}
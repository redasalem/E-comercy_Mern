import mongoose , {Schema,Document, model, type ObjectId} from "mongoose";
import type { Iproduct } from "./productModel.js";


const CartStatusEnum = ["active","completed"];


export interface IcartItem extends Document{
    product:Iproduct;
    unitPrice:number;
    quantity:number;

}


export interface Icart extends Document{
    userId:string | ObjectId;
    items:IcartItem[];
    totalAmount:number;
    status:"active" | "completed"
}

const cartItemSchema = new Schema<IcartItem>({
    product:{ type:Schema.Types.ObjectId,ref:"Product",required:true},
    quantity:{type:Number,required:true,default:1},
    unitPrice:{type:Number,required:true}
})

const cartSchema = new Schema<Icart>({
    userId:{ type:Schema.Types.ObjectId,ref:"User",required:true},
    items:[cartItemSchema],
    totalAmount:{type:Number,required:true},
    status:{type:String,enum:CartStatusEnum,default:"active"}
})

export const cartModel = mongoose.model<Icart>("Cart",cartSchema);
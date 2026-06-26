import { cartModel } from "../models/cartModel.js";
import { productModel } from "../models/productModel.js";

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
        return await createCartForUser({userId});
    }

    return cart;

}

interface AddItemToCart {
    userId: string;
    product: string;   // product _id
    quantity: number;
}

export const addItemToCart = async ({ userId, product, quantity }: AddItemToCart) => {

    // Get (or create) the active cart for this user
    const cart = await getActiveCartForUser({ userId });

    // Guard: should never happen since getActiveCartForUser always returns a cart
    if (!cart) {
        return { error: "Cart not found" };
    }

    // Check that the product exists
    const existingProduct = await productModel.findById(product);
    if (!existingProduct) {
        return { error: "Product not found" };
    }

    // Check if the item is already in the cart
    const existingItemIndex = cart.items.findIndex(
        (item: any) => item.product.toString() === product
    );

    if (existingItemIndex > -1) {
        // Product already in cart → just increment quantity
        const existingItem = cart.items[existingItemIndex];
        if (existingItem) {
            existingItem.quantity += quantity;
        }
    } else {
        // New product → push a fresh cart item
        cart.items.push({
            product: existingProduct as any,
            unitPrice: existingProduct.price,
            quantity,
        } as any);
    }

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce(
        (total: number, item: any) => total + item.unitPrice * item.quantity,
        0
    );

    await cart.save();

    return cart;
};
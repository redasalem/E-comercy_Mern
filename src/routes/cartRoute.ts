import express from "express";
import { getActiveCartForUser } from "../controllers/cart.js";
import { validateJWT } from "../middlewares/validatedJWT.js";

const router = express.Router();


router.get('/', validateJWT ,async (req,res)=>{
    //get active cart
    //get the user from jwt
    const userId = req.user._id;

    const cart = await getActiveCartForUser({userId:userId});

    res.status(200).send(cart);



})


export default router;
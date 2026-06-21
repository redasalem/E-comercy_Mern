import type { NextFunction, Request, Response } from "express";
import Jwt  from "jsonwebtoken";
import { userModel } from "../models/userModel.js";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const validateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authoriztionHeader = req.get('authoriztion');

    if(!authoriztionHeader){
        res.status(403).send("Authoriztion Header was not provied");
        return;
    }

    const token = authoriztionHeader.split(" ")[1];

    if(!token){
        res.status(403).send("Bearer token not found");
        return;
    }

    Jwt.verify(token,`${process.env.JWT_SECRET}`, async (err, payload) => {
        if(err){

            res.status(403).send("invalid token");
            return;
        }

        if(!payload){
            res.status(403).send('Invalid Token payload');
            return;
        }
       


        //fetch user from database based on payload
        const payloadData = payload as Jwt.JwtPayload;
        const user = await userModel.findOne({email: payloadData.email});
        req.user = user;
        next();



    })


    







}
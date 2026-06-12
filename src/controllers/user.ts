import type { Request, Response } from "express";
import { userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // 1. Basic validation
        if (!firstName || !lastName || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        // 2. Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email is not valid !" });
            return;
        }

       const hashPassword = await bcrypt.hash(password, 10);


        // 3. Create and save the new user
        // Note: For a production app, remember to hash the password (e.g., using bcrypt) before saving!
        const newUser = new userModel({
            firstName,
            lastName,
            email,
            password:hashPassword
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "1d" });

        // 4. Return success response
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


//login


export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // 1. Basic validation
        if ( !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }


         // 2. Check if user already exists
        const existingUser = await userModel.findOne({ email});
        if (!existingUser) {
            res.status(400).json({ message: "Invalid Email or Password" });
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            res.status(400).json({ message: "Invalid Email or Password" });
            return;
        }

        const token = jwt.sign({id:existingUser._id}, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "1d" })

        // 4. Return success response
        res.status(200).json({
            message: "User logged in successfully",
            token,
            user: {
                id: existingUser._id,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                email: existingUser.email
            }
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



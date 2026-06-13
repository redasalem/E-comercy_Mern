import exprss from "express";
import mongoose from "mongoose";
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';

const app = exprss();

const PORT = process.env.PORT || 5000;

//middleware
app.use(exprss.json());

//connect to MongoDB
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/ecommerce")
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.log("Error connecting to MongoDB", error);
});

//call routes

app.use("/user",userRoute);

app.use("/products",productRoute);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});






import exprss from "express";
import mongoose from "mongoose";

const app = exprss();

const PORT = process.env.PORT || 5000;

//middleware
app.use(exprss.json());

//connect to MongoDB

mongoose.connect("mongodb://localhost:27017/e-comercy")
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.log("Error connecting to MongoDB", error);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});






import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { connectDatabase } from "./config/db.js";
import userRouter from "./routes/UserRoute.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 2000;

app.get("/", (req, res)=>{
    res.send("nothing...");
})

app.use("/api/user", userRouter)

// Data Connected
const startDatabase = async ()=>{
    await connectDatabase();
    app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`)
})}

startDatabase();
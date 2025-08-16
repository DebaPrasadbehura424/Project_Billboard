import cors from "cors";
import express from "express";
import connection from "./server/database/TestDb.js";
import AuthTable from "./server/model/AuthModel.js";
import AuthRoutes from "./server/routes/AuthRoutes.js";




//database connection
connection;


//database tables
AuthTable();

const app=express();
app.use(express.json());
app.use(cors());


//accessing the auth
app.use("/api/auth",AuthRoutes);



app.get("/",(_req , res)=>{
  res.status(200).send("howm page of the backend...")
});


app.listen(2000,()=>{
  console.log("backend connected...");
});
const express=require("express");
const cors=require("cors");
const {Pool}=require("pg");
const dotenv=require("dotenv");
const path = require('path');



dotenv.config();
const app=express();




app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const pool=new Pool({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT
});
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("PORT:", process.env.PORT);

pool.connect()
    .then(()=>console.log("Connected to PostgreSQL"))
    .catch(err=>console.error("Database connection error",err));

const authRoutes=require("./routes/auth")(pool);
console.log(authRoutes);
console.log("Auth routes loaded:", authRoutes.stack.map(layer => layer.route.path));

app.use("/auth",authRoutes);
const path = require("path");
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});


  

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`)
});

module.exports = pool;

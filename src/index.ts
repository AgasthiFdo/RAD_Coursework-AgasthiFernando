import { error } from "console"
import express, { Application, Request, Response } from "express"
import mongoose from "mongoose"
import cors from "cors"
import authRoute from "./routes/authRoute"
import FoodRoute from "./routes/FoodRoute"
import RecipeRoute from "./routes/RecipeRoute"
import NotifyRoute from "./routes/NotifyRoutes"
import ReviewRouter from "./routes/ReviewRoutes"
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
dotenv.config();

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI as string

const app: Application = express()

const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin: "*",
        methods: ["GET","POST","PUT","DELETE"]
    }
})
app.set("io",io)

io.on("connection",(socket)=>{
    console.log("User connected", socket.id)

    socket.on("join_admin_room", () =>{
        socket.join("admin")
        console.log(`User ${socket.id} joind admin`)
    })
    socket.on("disconnect", ()=>{
        console.log("User disconnected", socket.id)
    })
})

app.use(cors({origin:"*"}))
const FRONTEND_URL = process.env.FRONTEND_URL ;
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit:'50mb', extended:true}))
app.use("/api/v1/auth", authRoute)
app.get("/",(req: Request, res: Response) =>{
    res.send("Hello TS Express")
}) 
app.use("/api/v1/food", FoodRoute)
app.use("/api/v1/recipe", RecipeRoute )
app.use("/api/v1/notification",NotifyRoute)
app.use("/api/v1/review",ReviewRouter)



const mongo = mongoose.connect(MONGO_URI)
mongo.then(() =>{
    console.log("MongoDb Connected")
}).catch((error) =>{
    console.error(error)
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

import express from "express"
import cors from "cors" // A middleware that handles Cross-Origin Resource Sharing (CORS), which controls which domains can access the server.
import cookieParser from "cookie-parser" // A middleware that parses cookies from incoming HTTP requests.


const app = express()
app.use(cors({ // enables CORS middleware.
    origin: process.env.CORES_ORIGIN, //Allows requests only from a specific domain (set in the environment variable CORES_ORIGIN). means if CORES_ORIGIN="https://example.com", only https://example.com can access the server.
    credentials : true 
}))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes 
import userRouter from './routes/user.router.js'

// route declaration 
app.use("/api/v1/users",userRouter)





export {app}

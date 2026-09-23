import dotenv from "dotenv"
dotenv.config() 
import express from "express"
import { ConnectDB } from "./src/Database/database.js"
import router from "./src/routes/user.routes.js"
import cors from "cors"
import { errorHandler } from "./src/middleware/error.middleware.js"
import authRouter from './src/routes/auth.routes.js'
import cookieParser from "cookie-parser"
import Imagerouter from "./src/routes/image.routes.js"
import rateLimit from "express-rate-limit"

const app = express()

// Apply rate limiting to all requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { message: "Too many requests from this IP, please try again after 15 minutes" }
})

app.use(limiter)

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api', router)
app.use('/api/auth', authRouter)
app.use('/api/images', Imagerouter)
app.use(errorHandler)

ConnectDB().catch(console.error);

if (process.env.NODE_ENV !== 'production') {
    app.listen(process.env.PORT || 3000, () => {
        console.log('SERVER RUNNING ...')
    })
}

export default app;
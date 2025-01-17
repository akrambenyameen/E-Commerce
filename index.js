import express from 'express'
import dotenv from 'dotenv'
import { appRouter } from "./src/app.router.js";
import { connectDB } from './DB/connection.js';
dotenv.config()

const app = express()
connectDB()
const port = process.env.port
appRouter(app, express)

app.listen(port, () => console.log(`app running on port ${port}`))
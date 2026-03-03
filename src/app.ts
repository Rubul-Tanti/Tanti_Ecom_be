import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { corsConfig } from './config/cors_config'
import { RequestLogger } from './middleware/requestLogger'

export const app=express()
app.use(helmet())
app.use(RequestLogger)

app.use(cors(corsConfig))
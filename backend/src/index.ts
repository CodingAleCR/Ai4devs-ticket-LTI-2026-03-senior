import { Request, Response, NextFunction } from 'express'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './db'
import { candidatesRouter } from './routes/candidates'
import { suggestionsRouter } from './routes/suggestions'
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

export const app = express()

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
)

app.use(express.json({ limit: '2mb' }))

app.get('/', (_req, res) => {
  res.send('Hola LTI!')
})

app.use('/api/candidates', candidatesRouter)
app.use('/api/suggestions', suggestionsRouter)

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next)
})

const port = Number(process.env.PORT) || 3010

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
}

export default prisma

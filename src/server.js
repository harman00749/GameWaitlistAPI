import './config/loadEnv.js'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import waitlistRoutes from './routes/waitlistRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFoundHandler } from './middleware/notFoundHandler.js'

const app = express()
const PORT = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.get('/api/health', (_request, response) => {
  response.status(200).json({
    success: true,
    message: 'Game Waitlist API is running.',
    data: {
      status: 'ok',
      uptime: process.uptime(),
    },
  })
})

app.use('/api/waitlist', waitlistRoutes)
app.use('/api', notFoundHandler)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Game Waitlist API running on http://localhost:${PORT}`)
})

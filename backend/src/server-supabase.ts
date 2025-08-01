import * as express from 'express'
import * as cors from 'cors'
import * as helmet from 'helmet'
import * as compression from 'compression'
import * as rateLimit from 'express-rate-limit'
import * as dotenv from 'dotenv'
import { supabase } from './lib/supabase'

// Load environment variables
dotenv.config({ path: '.env.supabase' })

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet.default())
app.use(compression())

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:5173',
  'https://jdmarcng.com'
]

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))

// Rate limiting
const limiter = rateLimit.default({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})

app.use('/api', limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    service: 'JD Marc Backend API'
  })
})

// API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'JD Marc Backend API',
    version: process.env.API_VERSION || 'v1',
    status: 'running'
  })
})

// Projects API
app.get('/api/projects', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({ projects: data })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/projects', async (req, res) => {
  try {
    const { title, description, status, budget, start_date, end_date, location } = req.body

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        title,
        description,
        status: status || 'planning',
        budget,
        start_date,
        end_date,
        location
      }])
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.status(201).json({ project: data[0] })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Contacts API
app.get('/api/contacts', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({ contacts: data })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, phone, company, message } = req.body

    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        name,
        email,
        phone,
        company,
        message,
        status: 'new'
      }])
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.status(201).json({ contact: data[0] })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// File upload endpoint
app.post('/api/upload', async (req, res) => {
  try {
    const { bucket, path, file, contentType } = req.body

    if (!bucket || !path || !file) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(file, 'base64')

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: contentType || 'application/octet-stream',
        upsert: true
      })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    res.json({ 
      success: true, 
      file: data, 
      url: urlData.publicUrl 
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something broke!' })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 JD Marc Backend running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
  console.log(`📚 API docs: http://localhost:${PORT}/api`)
})

export default app
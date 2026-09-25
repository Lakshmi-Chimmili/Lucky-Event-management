const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { APP_NAME } = require('./config/constants');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Robust CORS Configuration for Localhost, Vercel and Render
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'https://lucky-event-management-ejqy.vercel.app',
  'https://lucky-event-management-1.onrender.com'
];

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(',').forEach((url) => {
    const cleanUrl = url.trim().replace(/\/$/, '');
    if (cleanUrl && !allowedOrigins.includes(cleanUrl)) {
      allowedOrigins.push(cleanUrl);
    }
  });
}

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  const normalized = origin.trim().replace(/\/$/, '');
  return (
    allowedOrigins.some((a) => a.trim().replace(/\/$/, '') === normalized) ||
    normalized.endsWith('.vercel.app') ||
    normalized.endsWith('.onrender.com') ||
    process.env.NODE_ENV !== 'production' ||
    process.env.CLIENT_URL === '*'
  );
};

const corsOptions = {
  origin: function (origin, callback) {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Explicit header fallback middleware for preflights & proxies
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && isOriginAllowed(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes Mounting
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Welcome root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    appName: APP_NAME,
    message: `Welcome to ${APP_NAME} Backend API`
  });
});

// Error Handling Middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[${APP_NAME} Server] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`👉 Local Server URL: http://localhost:${PORT}`);
  console.log(`👉 API Health Endpoint: http://localhost:${PORT}/api/health`);
});

module.exports = app;

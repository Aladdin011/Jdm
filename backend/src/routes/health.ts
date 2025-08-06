import express from 'express';

const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
    },
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  };

  res.status(200).json(healthData);
});

// Detailed health check
router.get('/detailed', (req, res) => {
  const memoryUsage = process.memoryUsage();
  
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: process.uptime(),
      formatted: formatUptime(process.uptime()),
    },
    memory: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100,
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100,
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100,
      external: Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100,
    },
    cpu: {
      usage: process.cpuUsage(),
    },
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    platform: process.platform,
    nodeVersion: process.version,
  };

  res.status(200).json(healthData);
});

// Format uptime in human readable format
function formatUptime(uptime: number): string {
  const days = Math.floor(uptime / (24 * 60 * 60));
  const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((uptime % (60 * 60)) / 60);
  const seconds = Math.floor(uptime % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export default router;

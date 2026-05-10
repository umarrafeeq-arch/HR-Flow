import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  // In AI Studio dev environment, we assume development mode unless PORT is specifically for production (Cloud Run)
  // Cloud Run sets PORT (usually 8080). AI Studio doesn't set it by default, or it's 3000.
  const isProd = process.env.NODE_ENV === 'production' || (!!process.env.PORT && process.env.PORT !== '3000');

  console.log(`[Server] Starting in ${isProd ? 'PRODUCTION' : 'DEVELOPMENT'} mode`);
  console.log(`[Server] Target Port: ${PORT}`);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', mode: isProd ? 'production' : 'development' });
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000,
        hmr: {
          clientPort: 443 
        }
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Server] Vite middleware mounted');
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    console.log(`[Server] Serving static files from: ${distPath}`);
    
    // Serve static files from 'dist'
    app.use(express.static(distPath, {
      maxAge: '1y',
      immutable: true,
      index: 'index.html'
    }));
    
    // SPA Fallback
    app.get('*', (req, res) => {
      // Avoid falling back for static assets that are missing
      if (req.path.includes('.') && !req.path.endsWith('.html')) {
        return res.status(404).send('Not Found');
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Server] Ready at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal Error:', err);
});

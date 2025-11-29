import express from 'express';
import cors from 'cors';
import config from 'config';
import { createServer } from 'http';
import sequelize from './db/sequelize';
import authRouter from './routers/auth';
import vacationsRouter from './routers/vacations';
import reportsRouter from './routers/reports';
import notFound from './middlewares/not-found';
import errorResponder from './middlewares/error/responder';
import { initializeSocket } from './services/socket';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
initializeSocket(httpServer);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/vacations', vacationsRouter);
app.use('/api/reports', reportsRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFound);
app.use(errorResponder);

const PORT = config.get('app.port');
const APP_NAME = config.get('app.name');

// Database connection and sync
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced successfully');
        httpServer.listen(PORT, () => {
            console.log(`${APP_NAME} is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Unable to sync database:', error);
    });

export default app;

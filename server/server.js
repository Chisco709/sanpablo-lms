import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import courseRouter from './routes/courseRoute.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parsear JSON globalmente

// Rutas públicas (sin Clerk)
app.get('/', (req, res) => res.send("API Working"));
app.use('/api/course', courseRouter);

// Rutas privadas (con Clerk)
app.use(clerkMiddleware());
app.use('/api/user', userRouter);
app.use('/api/educator', educatorRouter);

// Webhooks (manejo especial de JSON)
app.post('/clerk', clerkWebhooks);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// Middleware de errores (¡ahora sí se ejecuta!)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Conexiones y inicio
await connectDB();
await connectCloudinary();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
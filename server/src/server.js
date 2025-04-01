import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from './lib/db.js';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

/* MIDDLEWARE */
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: 'http://localhost:5173',
	})
);

/* ROUTES */
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

app.listen(PORT, () => {
	console.log(`SERVER IS RUNNING ON ${PORT}`);
	connectDB();
});

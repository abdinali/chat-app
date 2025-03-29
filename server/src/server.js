import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { connectDB } from './lib/db.js';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

/* MIDDLEWARE */
app.use(express.json());
app.use(cookieParser());

/* ROUTES */
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

app.listen(PORT, () => {
	console.log(`SERVER IS RUNNING ON ${PORT}`);
	connectDB();
});

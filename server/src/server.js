import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
	console.log(`SERVER IS RUNNING ON ${PORT}`);
});

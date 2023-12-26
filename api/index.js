import express from  'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();


mongoose.connect(
    process.env.MONGO
    ) .then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error(err)
});

const app = express();

// Next line allows us to send json data to the backend
app.use(express.json());

app.listen(3000, () => {
    console.log('Server running on port 3000!!!');
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
})
/* eslint-disable import/no-unresolved */
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// eslint-disable-next-line import/extensions
import authRoutes from './routes/auth';
// eslint-disable-next-line import/extensions
import postRoutes from './routes/post';
import subRoutes from './routes/subs';

// eslint-disable-next-line import/extensions
import trim from './middlewares/trim';

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.ORIGIN,
  optionsSuccessStatus: 200,
}));
app.use(trim);
const { PORT } = process.env;
app.get('/', (_, res) => {
  res.send('Hello world');
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/subs', subRoutes);

app.listen(PORT, async () => {
  console.log('Server running on 5000');
  try {
    await createConnection();
    console.log('Database connected !');
  } catch (error) {
    console.log(error);
  }
});

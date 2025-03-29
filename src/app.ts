import 'module-alias/register';
import express, { Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import { errorMiddleware } from '@middlewares/error.middleware';
import { requestLogger } from '@middlewares/request.logger.middleware';
import { responseMiddleware } from '@middlewares/responseMiddleware';
import passport from 'passport';
import router from './routes';
import { notFoundMiddleware } from '@middlewares/notfound.middleware';
import { setupSwagger } from '@config/swagger';

const app = express();

setupSwagger(app);


app.use(express.json());
app.use(responseMiddleware);

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies and authentication headers
};
app.use(cors(corsOptions));


const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(compression());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(requestLogger);

app.use(limiter);


app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.sendResponse(200, 'Your API is live and secured!');
});

app.use(errorMiddleware);
app.use(notFoundMiddleware);


export default app;

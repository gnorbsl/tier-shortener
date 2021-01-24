import express, {
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from 'express';
import bodyParser from 'body-parser';
import { ValidateError } from '@tsoa/runtime';
import RateLimit from 'express-rate-limit';
import { mw } from 'request-ip';
import { RegisterRoutes } from '../build/routes';
import UrlNotFoundError from './common/errors/UrlNotFoundError';

const app = express();

app.use(mw());

// Use body parser to read sent json payloads

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());

RegisterRoutes(app);

app.use((
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction,
): ExResponse | void => {
  console.log(err);
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: 'Validation Failed',
      details: err?.fields,
    });
  }

  if (err instanceof UrlNotFoundError) {
    return res.status(err.status).json({ success: false, error: err.message });
  }
  if (err instanceof Error) {
    console.error(err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }

  return next();
});

app.use((_req, res: ExResponse) => {
  res.status(404).send({
    success: false,
    message: 'Not Found',
  });
});

const limiter = RateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 requests, per ip per minute
});

app.use(limiter);

export default app;

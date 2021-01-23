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

app.use((_req: ExRequest, res: ExResponse) => {
  res.status(404).send({
    message: 'Not Found',
  });
});
app.use((
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction,
): ExResponse | void => {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: 'Validation Failed',
      details: err?.fields,
    });
  }
  if (err instanceof Error) {
    console.error(err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }

  return next();
});

const limiter = RateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 requests, per ip per minute
});

app.use(limiter);

export default app;

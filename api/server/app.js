/* eslint-disable linebreak-style */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import debug from 'debug';
import morgan from 'morgan';
import router from './routes';
import swaggerDocument from './swagger/swagger.json';

const Debug = debug('http');

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', router);

app.get('/api/v1', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Quick-Credit',
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  Debug(`App is listening at port ${port}`);
});

export default app;

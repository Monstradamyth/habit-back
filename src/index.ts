import express, { Request, Response } from 'express';
import "./services/user/modules/auth/passport";

import "./services/habit/db"

import router from './router';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

const app = express();
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use(cors())
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log({
    url: req.url,
    body: req.body,
    params: req.params,
    method: req.method,
    auth: req.headers.authorization,
  })
  next()
})

app.use(router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});


app.use((err: any, req: any, res: any, next: any) => {
  if (!err) return next();
    const message = err.message ? err.message : "Internal server error"
    console.log(`Req url: ${req.url} \n Req body: ${req.body} \n Error: ${err} \n Stack: ${err.stack} \n`)
    res.status(500).send(message)
});
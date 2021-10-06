// import needed npm modules
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as compression from 'compression';

// import the controllers needed for the app
// import { apiController } from './server/Controllers/api';
// import * as morgan from 'morgan';

// Create a new express application instance and set values
const app = express();

// app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
app.use(compression(9));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Mount the controllers at the routes
// app.use('/api', apiController);

// Get the angular front end code
app.use(express.static(path.join(__dirname, 'dist/frontend')));

// Send all other requests to the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/frontend/index.html'));
});

// The port the express app will listen on
const port = process.env.PORT || 4800;

// Serve the application at the given port
// @ts-ignore
const server = app.listen(port, '0.0.0.0', () => {
  // Success callback
  console.log(`Listening at http://localhost:${port}/`);
});


server.on('connection', function (socket) {
  // console.log("A new connection was made by a client.");
  socket.setTimeout(5 * 1000);
  // 30 second timeout. Change this as you see fit.
});

server.on('uncaughtException', function (req, res, route, err) {
  console.log('error', route, err);
  if (!res.headersSent) {
    return res.status(500).json({
      title: err.message ? err.message : err
    });
  }
});
// server.on('warning', e => console.warn(e.stack));
// server.setMaxListeners(0);

// server.timeout = 100000;
export const portt :any = port;

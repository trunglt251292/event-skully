/**
 * Creating Project REST API Project
 */
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";
import socketEvents from './socketio/socket';
import configs from './api/config';
import {getTotalSkully} from "./api/libs/CrawlerSkully";

/**
 * Global variables
 */
const app = express();
const debug = require('debug')('workspace:server');
const http = require('http');
const socketio = require('socket.io');
const port = normalizePort(process.env.PORT || 8002);
const server = http.createServer(app);
const io = socketio.listen(server);

mongoose.Promise = global.Promise;
mongoose.connect(configs.mongoURL, (err) => {
  if (err){
    console.log(err);
  }else {
    console.log('Da ket noi ket noi thanh cong!!!!');
    getTotalSkully();
  }
});
/**
 * Use, Set
 */
app.use(morgan("dev"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set('port', port);
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
/**
 * Socket IO
 */
socketEvents(io);
/**
 * Setup Dev
 */
server.listen(port, function () {
  console.log('Server dang hoat dong nhe!!!! port : ' + port);
});
// Kue UI
import {queueUI} from './api/Queue';

queueUI.listen(configs.kueUI.port, function () {
  console.log('Queue listening on port:' + configs.kueUI.port);
});
import * as web3_Socket from './api/libs/events/main.event';
import * as Auction from './api/libs/events/auction.event';
//server lang nghe
import * as worker from './api/workers/index.workers';

server.on('error', onError);
server.on('listening', onListening);

// method
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

export default app;

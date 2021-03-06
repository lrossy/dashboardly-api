const express = require('express');
const mysql = require('promise-mysql');

// Express middleware
const bodyParser = require('body-parser');
const morgan = require('morgan');

const checkLoginToken = require('./lib/check-login-token.js');

// Data loader
const DashboardlyDataLoader = require('./lib/dashboardly.js');

// Controllers
const authController = require('./controllers/auth.js');
const boardsController = require('./controllers/boards.js');
const bookmarksController = require('./controllers/bookmarks.js');


// Database / data loader initialization
const connection = mysql.createPool({
  host: '192.168.2.32',
  user: 'root',
  password: 'l12321l',
  database: 'dashboardly'
});
const dataLoader = new DashboardlyDataLoader(connection);


// Express initialization
const app = express();
app.use(morgan('dev'));

// var corsOptions = {
//   origin: 'http://localhost',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
//
// app.use(cors(corsOptions));

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PATCH, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(bodyParser.json());
app.use(checkLoginToken(dataLoader));

app.use('/auth', authController(dataLoader));
app.use('/boards', boardsController(dataLoader));
app.use('/bookmarks', bookmarksController(dataLoader));


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  if (process.env.C9_HOSTNAME) {
    console.log(`Web server is listening on https://${process.env.C9_HOSTNAME}`);
  } else {
    console.log(`Web server is listening on http://localhost:${port}`);
  }
});

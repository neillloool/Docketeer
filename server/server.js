/**
 * ************************************
 *
 * @module Server
 * @author Catherine Larcheveque, Lorenzo Guevara, Charles Ryu, Griffin Silver, Alex Smith
 * @date 6/14/2021
 * @description Server listens on port 3000 and routes all incoming requests, handles global middleware errors and unknown endpoint errors
 *
 * ************************************
 */

const express = require('express');
const path = require('path');
const cors = require('cors');

// import router
const signupRouter = require('./routes/signupRouter');
const loginRouter = require('./routes/loginRouter');

const app = express();
const PORT = 3000;

app.use(express.json()); // parses the request body
app.use(express.urlencoded({ extended: true })); // parses urlencoded payloads
app.use(cors()); // enables ALL cors requests

// route all requests to signup through signupRouter
app.use('/signup', signupRouter);
app.use('/login', loginRouter);

// Unknown Endpoint Error Handler
app.use('/', (req, res) => {
  return res.status(404).json('404 Not Found');
});

// Global Error Handler
app.get('/', (req, res, next, err)=> {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occured' },
  };

  const errorObj = Object.assign(defaultErr, err);

  console.log(errorObj.log);
  
  return res.status(errObj.status).json(errorObj.message);
});

// Open up server on PORT
app.listen(PORT, ()=> {
    console.log(`server is listening on port ${PORT}`)
});

module.exports = app;
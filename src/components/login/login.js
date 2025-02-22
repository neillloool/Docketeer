/**
 * ************************************
 *
 * @module Login
 * @author Brent Speight, Emma Czech, May Li, Ricardo Cortez
 * @date 6/10/2021
 * @description Login component which renders a login page, and sign-up modal. This is the first component that is appended to the dist/.renderer-index-template.html via renderer/index.js
 *
 * ************************************
 */

// NPM Module Imports
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, BrowserHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-modal';
// Redux Imports (actions)
import * as actions from '../../actions/actions';

// React Component Imports
import App from '../App';
import DebugRouter from '../debug/debugRouter';

// Material UI Imports
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Docketeer from '../../../assets/docketeer-title.png';
// Helper Functions Import
// import { handleLogin, authenticateUser } from '../helper/loginHelper';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const Login = () => {
  
  // React-Redux: Map dispatch to props
  const dispatch = useDispatch();
  const updateSession = () => dispatch(actions.updateSession());
  const updateUser = (userInfo) => dispatch(actions.updateUser(userInfo));

  // React-Redux: Map state to props
  const session = useSelector((state) => state.session.isLoggedIn);

  // React Hooks: Local state variables 
  const [ modalIsOpen, setIsOpen ] = useState(false);
  
  // Material UI
  const classes = useStyles();

  // Need to set the app element to body for screen-readers (disability), otherwise modal will throw an error
  useEffect(() => {
    fetch('http://localhost:3000/db')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return console.log('Connected to DB successfully', data);
      })
      .catch((err) => {
        return console.log('Fetch request to /db failed:', err);
      });
  }, []);
  
  // callback function invoked when 'login' button is clicked
  const handleLogin = (e) => {
    e.preventDefault(); // prevents form submit from reloading page
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value;
    const password = passwordInput.value;

    // clears input fields after login
    usernameInput.value = '';
    passwordInput.value = '';

    authenticateUser(username, password);
  };
  
  // callback function which will send request to endpoint http://localhost:3000/login and expect either SSID in cookie.
  const authenticateUser = (username, password) => {

    fetch('http://localhost:3000/login', 
      { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (Object.prototype.hasOwnProperty.call(data, 'error')) {
          window.alert(data.error);
        }
        else {
          updateSession(); // loggedIn = true 
          updateUser(data); // update user info in sessions reducer
        }
      })
      .catch((err) => {
        console.log('Fetch: POST error to /login', err);
      });
  };

  // Upon successful login, redirect to /app location and render the App component

  // Note: this could be re-worked, just thinking about it this looks like poor security design since loggedIn is a local state variable on client end which can be hardcoded to true. Rather, the server should verify credentials and then send client either SSID to access next endpoint or another means.
  if (session){
    return (
      <Router
        history={BrowserHistory}
      >
        <Redirect to="/app"/>
        <Switch>
          {/* <Route component={App} exact path="/app" /> */}
          <Route path="/app">
            <App />
          </Route>
        </Switch> 
      </Router>
    );
  }
  
  // Else render the login page
  return (
    <Router 
      history={BrowserHistory}
    >
      <Route id="route" path="/"> 
        <header>
          <img src={Docketeer} width={160} />
        </header>
        <br></br>
        <br></br>
        <br></br>
        <div className="renderContainers">
          <div className="header">
            <h1 className="tabTitle">Login</h1>
          </div>
          <div className="settings-container">
            <form className={classes.root} onSubmit={handleLogin}>
              {/* <input id="username" type="text" placeholder="username"></input> */}
              <TextField id="username" label="Username" variant="outlined" />
              <br></br>
              <br></br>
              {/* <input id="password" type="password" placeholder="password"></input> */}
              <TextField id="password" label="Password" type="password" variant="outlined" />
              {/* <input type="submit"></input> */}
              <br></br>
              <Button variant="contained" color="primary" type="submit" size="medium" className={classes.button}>
                Login
              </Button>
              <hr></hr>
              <div className="g-signin2" data-onsuccess="onSignIn" style={{width: '200px', borderRadius:'4px'}}></div>
              
            </form>
          </div>
        </div>
      </Route>
    </Router>
  );
};

export default Login;
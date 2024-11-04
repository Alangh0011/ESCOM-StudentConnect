// App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Login from './Auth/Login';
import Register from './Auth/Register';
import Home from './Home-page/Home';
import { GoogleMapsProvider } from './GoogleMapsContext';

function App() {
  const token = localStorage.getItem('token');
  const isTokenValid = token ? checkTokenValidity(token) : false;
  const [isLoggedIn, setIsLoggedIn] = useState(isTokenValid);

  useEffect(() => {
    if (token && !isLoggedIn) {
      setIsLoggedIn(checkTokenValidity(token));
    }
  }, [isLoggedIn, token]);

  function checkTokenValidity(token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return false;
    }
  }

  return (
    <GoogleMapsProvider>
      <Router>
        <Switch>
          <Route exact path="/" render={(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" component={Register} />
          <Route path="/home">
            {isLoggedIn ? <Home /> : <Redirect to="/login" />}
          </Route>
          <Route path="/login">
            <Login setIsLoggedIn={setIsLoggedIn} />
          </Route>
        </Switch>
      </Router>
    </GoogleMapsProvider>
  );
}

export default App;

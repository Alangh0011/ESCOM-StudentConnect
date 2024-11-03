import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Login from './Auth/Login';
import Register from './Auth/Register';
import Home from './Home-page/Home';

function App() {
  // Inicializar el estado de isLoggedIn directamente con el estado del token
  const token = localStorage.getItem('token');
  const isTokenValid = token ? checkTokenValidity(token) : false;
  const [isLoggedIn, setIsLoggedIn] = useState(isTokenValid);

  useEffect(() => {
    if (token && !isLoggedIn) {
      setIsLoggedIn(checkTokenValidity(token));
    }
  }, [isLoggedIn, token]);

  // Función para verificar si el token es válido
  function checkTokenValidity(token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime; // Verificar si el token no ha expirado
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return false;
    }
  }

  return (
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
  );
}

export default App;

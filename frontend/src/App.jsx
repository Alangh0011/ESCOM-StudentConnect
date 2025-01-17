import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Login from './Auth/Login';
import Register from './Auth/Register';
import Home from './Home-page/Home';
import Pagina from './Home-page/Pagina';
import { GoogleMapsProvider } from './GoogleMapsContext';
import Landing from './Landing/Landing';

const PrivateRoute = ({ children, ...rest }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = token && jwtDecode(token)?.exp > Date.now() / 1000;
 
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        setIsLoggedIn(decodedToken.exp > currentTime);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        handleLogout();
      }
    } else {
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <GoogleMapsProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <div className="flex-1">
            <Switch>
              <Route path="/login">
                {isLoggedIn ? <Redirect to="/home" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
              </Route>
              <Route path="/register">
                {isLoggedIn ? <Redirect to="/home" /> : <Register />}
              </Route>
              <PrivateRoute path="/home">
                <Home onLogout={handleLogout} />
              </PrivateRoute>
              <Route path="/">
                <Landing />
              </Route>
            </Switch>
          </div>
          {isLoggedIn && <Pagina onLogout={handleLogout} />}
        </div>
      </Router>
    </GoogleMapsProvider>
  );
}

export default App;
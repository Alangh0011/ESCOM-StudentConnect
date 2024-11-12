import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Login from './Auth/Login';
import Register from './Auth/Register';
import Home from './Home-page/Home';
import { GoogleMapsProvider } from './GoogleMapsContext';

// Componente para rutas protegidas
const PrivateRoute = ({ children, isAuthenticated, ...rest }) => (
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
        
        if (decodedToken.exp > currentTime) {
          setIsLoggedIn(true);
        } else {
          // Token expirado
          handleLogout();
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        handleLogout();
      }
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
        <Switch>
          <Route exact path="/">
            {isLoggedIn ? <Redirect to="/home" /> : <Redirect to="/login" />}
          </Route>

          <Route 
            path="/login"
            render={(props) => 
              isLoggedIn ? (
                <Redirect to="/home" />
              ) : (
                <Login {...props} setIsLoggedIn={setIsLoggedIn} />
              )
            }
          />

          <Route 
            path="/register"
            render={(props) => 
              isLoggedIn ? (
                <Redirect to="/home" />
              ) : (
                <Register {...props} />
              )
            }
          />

          <PrivateRoute path="/home" isAuthenticated={isLoggedIn}>
            <Home onLogout={handleLogout} />
          </PrivateRoute>

          {/* Ruta de fallback para URLs no encontradas */}
          <Route path="*">
            <div className="flex flex-col items-center justify-center min-h-screen">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-gray-600 mb-4">Página no encontrada</p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Volver al inicio
              </button>
            </div>
          </Route>
        </Switch>
      </Router>
    </GoogleMapsProvider>
  );
}

export default App;
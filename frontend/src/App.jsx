import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Home from './Home-page/Home';
import Actualizar from './Home-page/Actualizar';
import Agregar from './Home-page/Agregar';

function App() {
  // Estado para controlar si el usuario ha iniciado sesión
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Switch>
        {/* Ruta para la página de inicio de sesión */}
        <Route exact path="/" render={(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />} />
        {/* Ruta para la página de registro */}
        <Route path="/register" component={Register} />
        {/* Ruta protegida para la página de inicio */}
        <Route path="/home">
          {/* Redirigir al usuario a la página de inicio de sesión si no ha iniciado sesión */}
          {isLoggedIn ? <Home /> : <Redirect to="/login" />}
        </Route>
        {/* Ruta para la página de inicio de sesión */}
        <Route path="/login">
          {/* Pasar la función setIsLoggedIn al componente Login */}
          <Login setIsLoggedIn={setIsLoggedIn} />
        </Route>
        {/* Ruta para la página de actualización de producto */}
        <Route path="/actualizar/:id" component={Actualizar} />
        {/* Ruta para la página de agregar producto */}
        <Route path="/agregar" component={Agregar} />
      </Switch>
    </Router>
  );
}

export default App;


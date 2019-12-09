import React from 'react';
import GraphQLProvider from './GraphQLProvider'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import LoginPage from "./user/LoginPage"
import RegisterPage from "./user/RegisterPage"

function App() {
  return (
    <GraphQLProvider>
      <Router>
        <Switch>
          <Route path="/" exact>
            <div>Welcome!<br /><Link to="/login">Login</Link><br /><Link to="/register">Signup</Link></div>
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/register">
            <RegisterPage />
          </Route>
        </Switch>
      </Router>
    </GraphQLProvider>
  );
}

export default App;

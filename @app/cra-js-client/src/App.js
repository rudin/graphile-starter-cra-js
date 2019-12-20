import React from "react"
import GraphQLProvider from "./GraphQLProvider"
import { AuthProvider, AuthConsumer, useUser, useAuth } from "./user"
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom"
import LoginPage from "./user/LoginPage"
import RegisterPage from "./user/RegisterPage"

function App() {
  return (
    <GraphQLProvider>
      <AuthProvider>
        <AuthConsumer>
          {({ user, logout, isAuthenticating }) =>
            user ? (
              <Router>
                <Switch>
                  <Route path="/" exact>
                    <div>
                      Welcome {user.name}!<br />
                      <div to="/logout" onClick={logout}>
                        Logout
                      </div>
                    </div>
                  </Route>
                  <Route path="/login">
                    <Redirect to="/" />
                  </Route>
                  <Route path="/register">
                    <Redirect to="/" />
                  </Route>
                </Switch>
              </Router>
            ) : (
                <Router>
                  <Switch>
                    <Route path="/" exact>
                      <div>
                        Welcome!
                      <br />
                        {isAuthenticating ? <div>loading...</div> : <><Link to="/login">Login</Link>
                          <br />
                          <Link to="/register">Signup</Link></>}
                      </div>
                    </Route>
                    <Route path="/login">
                      <LoginPage />
                    </Route>
                    <Route path="/register">
                      <RegisterPage />
                    </Route>
                  </Switch>
                </Router>
              )
          }
        </AuthConsumer>
      </AuthProvider>
    </GraphQLProvider>
  )
}

export default App

import React, { createContext, useEffect, useState, useContext } from "react"
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks"
import { loader } from "graphql.macro"
const CURRENT_USER = loader("../graphql/CurrentUser.graphql")
const LOGOUT_MUTATION = loader("../graphql/Logout.graphql")

export const AuthContext = createContext()
export const AuthConsumer = AuthContext.Consumer
export const useAuth = () => useContext(AuthContext)
export const useUser = () => {
  const { user } = useAuth()
  return user
}

export const AuthProvider = ({ children }) => {
  const client = useApolloClient()
  const [isAuthenticated, setAuthenticated] = useState(false)
  const [isAuthenticating, setAuthenticating] = useState(window.localStorage.getItem("authenticated") === "yes")
  const { loading, error, data, refetch } = useQuery(CURRENT_USER, {
    fetchPolicy: "network-only"
  })
  const [logoutMutation] = useMutation(LOGOUT_MUTATION)

  useEffect(() => {
    if (!loading) {
      if (data ?.currentUser && isAuthenticated === false) {
        console.log("Yes! Authenticated!")
        setAuthenticating(false)
        setAuthenticated(true)
        window.localStorage.setItem("authenticated", "yes")
      } else {
        console.log("No longer authenticated.")
        setAuthenticating(false)
        setAuthenticated(false)
        window.localStorage.setItem("authenticated", "no")
      }
    }
  }, [loading, data])

  const logout = () => {
    logoutMutation()
    setAuthenticating(false)
    setAuthenticated(false)
    client.resetStore()
    window.localStorage.setItem("authenticated", "no")
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setAuthenticated,
        isAuthenticating,
        setAuthenticating,
        logout,
        refetch,
        user: isAuthenticated ? data.currentUser : null
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

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
  const [isAuthenticating, setAuthenticating] = useState(false)
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
      } else {
        console.log("No longer authenticated.")
        setAuthenticating(false)
        setAuthenticated(false)
      }
    }
  }, [loading, data])

  const logout = () => {
    logoutMutation()
    setAuthenticating(false)
    setAuthenticated(false)
    client.resetStore()
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

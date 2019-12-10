import React from "react"
import useForm from "react-hook-form"
import { useMutation } from "@apollo/react-hooks"
import { useAuth } from "./"
import { loader } from "graphql.macro"
const LOGIN_MUTATION = loader("../graphql/Login.graphql")

export default () => {
  const { register, handleSubmit, watch, errors } = useForm()
  const [loginMutation, { data }] = useMutation(LOGIN_MUTATION)
  const { refetch } = useAuth()

  const onSubmit = data => {
    console.log("login")
    const values = data
    loginMutation({
      variables: {
        username: values.username,
        password: values.password
      }
    }).then(() => {
      refetch()
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate={true}
      style={{
        display: "flex",
        flexDirection: "column",
        width: 300,
        height: 200,
        justifyContent: "space-between"
      }}
    >
      <input
        name="username"
        type="username"
        ref={register({ required: true, minLength: 2 })}
        placeholder="username"
      />
      <input
        name="password"
        type="password"
        ref={register({ required: true, minLength: 2 })}
        placeholder="password"
      />
      <button type="submit">Register</button>
    </form>
  )
}

import React from "react"
import useForm from "react-hook-form"
import { useAuth } from "./"
import { useRegisterMutation } from "@app/graphql";

export default () => {
  const { register, handleSubmit, watch, errors } = useForm()
  const [registerMutation, { data }] = useRegisterMutation()
  const { refetch } = useAuth()

  const onSubmit = data => {
    console.log("register")
    const values = data
    registerMutation({
      variables: {
        username: values.username,
        email: values.email,
        password: values.password,
        name: values.name
      }
    }).then(result => {
      console.log(result)
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
        name="name"
        type="name"
        ref={register({ required: true, minLength: 2 })}
        autoFocus
        placeholder="name"
      />
      <input
        name="username"
        type="username"
        ref={register({ required: true, minLength: 2 })}
        placeholder="username"
      />
      <input
        name="email"
        type="email"
        ref={register({ required: true, minLength: 2 })}
        placeholder="email"
      />
      <input
        name="password"
        type="password"
        ref={register({ required: true, minLength: 2 })}
        placeholder="password"
      />
      <input
        name="confirm"
        type="password"
        ref={register({ required: true, minLength: 2 })}
        placeholder="conform"
      />
      <button type="submit">Register</button>
    </form>
  )
}

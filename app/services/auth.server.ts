import { Authenticator } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import { sessionStorage } from 'services/session.server'
import { compare, hash } from 'bcrypt'
import invariant from 'tiny-invariant'

import { db } from 'helpers/db'

export type User = {
  id: number
  username: string
  email: string
}

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage, { throwOnError: true })

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const formEmail = form.get('email')?.toString()
    invariant(formEmail, 'Email is required.')

    const formPassword = form.get('password')?.toString()
    invariant(formPassword, 'Password is required.')

    const userData = await db.user.findUnique({
      where: { email: formEmail }
    })
    invariant(userData, 'Invalid email or password.')

    const { password, ...user } = userData
    const isValidPassword = compare(password, formPassword)
    invariant(isValidPassword, 'Invalid email or password.')

    return user
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  'user-login'
)

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const formUsername = form.get('username')?.toString()
    invariant(formUsername, 'Username is required.')

    const formEmail = form.get('email')?.toString()
    invariant(formEmail, 'Email is required.')

    const formPassword = form.get('password')?.toString()
    invariant(formPassword, 'Password is required.')

    const hashedPassword = await hash(formPassword, 10)
    const { password, ...user } = await db.user.create({
      data: {
        email: formEmail,
        password: hashedPassword,
        username: formUsername
      }
    })

    return user
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  'user-register'
)

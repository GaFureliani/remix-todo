import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { authenticator } from 'services/auth.server'

export const action: ActionFunction = async ({ request }) => await authenticator.authenticate('user-login', request, { successRedirect: '/' })
export const loader: LoaderFunction = async ({ request }) => await authenticator.isAuthenticated(request, { successRedirect: '/' })

export default function LoginPage () {
  return (
    <div className='h-[calc(100vh-48px)] flex items-center justify-center'>
      <Form method='post'>
        <div className='border border-gray-300 shadow-xl bg-white p-4 grid grid-cols-1 gap-3 w-[315px] rounded-xl'>
          <h4 className='text-center my-2 text-2xl'>Log in</h4>
          <input type="email" name='email' placeholder='Email' className='shadow-md border border-gray-300 p-2 outline-none'/>
          <input type="password" name='password' placeholder='Password' className='shadow-md border border-gray-300 p-2 outline-none'/>
          <button className='border border-blue-400 py-2 shadow-md hover:bg-blue-50 transition rounded-full'>Log in</button>
        </div>
      </Form>
    </div>
  )
}

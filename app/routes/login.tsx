import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'

export const action: ActionFunction = async ({
  request
}) => {
  const data = await request.formData()
  const email = data.get('email')
  const password = data.get('password')

  return json({ email, password })
}

export default function LoginPage () {
  const data = useActionData()

  return (
    <div className='h-[calc(100vh-48px)] flex items-center justify-center'>
      <Form method='post'>
        <div className='border border-gray-300 shadow-xl bg-white p-4 grid grid-cols-1 gap-3 w-[315px] rounded-xl'>
          <h4 className='text-center my-2 text-2xl'>Log in</h4>
          <input type="email" name='email' placeholder='Email' className='shadow-md border border-gray-300 p-2 outline-none'/>
          <input type="password" name='password' placeholder='Password' className='shadow-md border border-gray-300 p-2 outline-none'/>
          <button className='border border-blue-400 py-2 shadow-md hover:bg-blue-50 transition rounded-full'>Log in</button>
          <pre>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </Form>
    </div>
  )
}

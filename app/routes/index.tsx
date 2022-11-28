import type { LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { User } from '~/services/auth.server'
import { authenticator } from '~/services/auth.server'

type LoaderData = User | null

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request)
  return user
}

export default function Index () {
  const user = useLoaderData<LoaderData>()
  if (user == null) {
    return (
      <h1>
        Hello Guest
      </h1>
    )
  }
  return (
    <h1 className="text-xl">
      Hello {user.username}
    </h1>
  )
}

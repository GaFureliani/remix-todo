import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import styles from './styles/app.css'
import datePickerStyles from 'react-datepicker/dist/react-datepicker.css'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from '@remix-run/react'
import { Layout } from './components/Layout'
import type { User } from './services/auth.server'
import { authenticator } from './services/auth.server'

export function links () {
  return [{ rel: 'stylesheet', href: styles }, { rel: 'stylesheet', href: datePickerStyles }]
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1'
})

export const loader: LoaderFunction = async ({ request }) => await authenticator.isAuthenticated(request)

export default function App () {
  const user = useLoaderData<User | null>()
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout user={user}>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

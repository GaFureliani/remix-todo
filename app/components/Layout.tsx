import type { ReactNode } from 'react'
import { Fragment } from 'react'
import type { User } from 'services/auth.server'
import { Appbar } from './Appbar'

type LayoutProps = { children: ReactNode, user: User | null }

export const Layout = ({ children, user }: LayoutProps) => {
  return (
    <Fragment>
      <Appbar user={user} />
      {children}
    </Fragment>
  )
}

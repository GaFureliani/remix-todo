import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { Appbar } from './Appbar'

type LayoutProps = { children: ReactNode }

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Fragment>
      <Appbar/>
      {children}
    </Fragment>
  )
}

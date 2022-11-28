// app/services/session.server.ts
import { createCookieSessionStorage } from '@remix-run/node'

// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session', // use any name you want here
    sameSite: 'lax', // this helps with CSRF
    path: '/', // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: ['01805541134a325c1485f7776e7200966b83566fc3686b35223fc8bc1cbf2e1dd75af23f402fabbe0f4ca730a700cb38d5c521b99a74f5af83ec253782bfc22f'], // replace this with an actual secret
    secure: process.env.NODE_ENV === 'production' // enable this in prod only
  }
})

// you can also export the methods individually for your own usage
export const { getSession, commitSession, destroySession } = sessionStorage

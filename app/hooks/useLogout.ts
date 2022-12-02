import { useSubmit } from '@remix-run/react'
import { useCallback } from 'react'

export const useLogout = () => {
  const submit = useSubmit()
  const logout = useCallback(() => {
    submit(null, { method: 'post', action: '/logout' })
  }, [submit])
  return logout
}

import { useSubmit } from '@remix-run/react'
import { useCallback } from 'react'
import { debounce } from '../helpers/debounce'

export const useDebouncedSubmit = (delay = 300) => {
  const submit = useSubmit()
  const debouncedSubmit = useCallback(debounce(submit, delay), [])
  return debouncedSubmit
}

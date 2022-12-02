import { useMemo, useState } from 'react'
import type { Todo } from '@prisma/client'
import { Form } from '@remix-run/react'
import ReactDatePicker from 'react-datepicker'
export const TodoEntry = (t: Todo) => {
  const [state, setState] = useState(t)
  const isSaveEnabled = useMemo(() => {
    return (
      t.description !== state.description ||
      t.isDone !== state.isDone ||
      t.targetDate !== state.targetDate
    )
  }, [t, state])
  return (
    <Form key={t.id} method='post' className='h-10 grid col-span-5 grid-cols-[100px_100px_repeat(3,1fr)] justify-items-center items-center w-full'>
      <span className='h-full'>
        <input type="hidden" name='id' readOnly value={t.id} />
        <span className='h-full'>{t.id}</span>
      </span>
      <span className='h-full'>
        <input
          type='checkbox'
          name='isDone'
          className='text-center w-5 h-5'
          checked={state.isDone}
          onChange={e => setState(state => ({ ...state, isDone: e.target.checked }))} />
      </span>
      <span className='h-full bg-red-500'>
        <input
          type='text'
          className='h-full shadow-md border border-gray-300 outline-none p-2'
          name='description'
          value={state.description}
          onChange={e => setState(state => ({ ...state, description: e.target.value }))} />
      </span>
      <span className='h-full'>
        <input type="hidden" name='targetDate' value={state.targetDate.toISOString()} />
        <ReactDatePicker
          className='h-10 shadow-md border border-gray-300'
          selected={new Date(state.targetDate)}
          onChange={date => {
            if (date == null) return
            setState(state => ({ ...state, targetDate: date }))
          }}
          showTimeInput
      />
      </span>

      <span className='flex items-center gap-2'>
        <button type='submit' name='intent' value='update' className='bg-blue-500 disabled:bg-blue-300 rounded-full px-4 py-2 text-white' disabled={!isSaveEnabled}>Save</button>
        <button type='submit' name='intent' value='delete' className='bg-red-500 hover:bg-red-600 rounded-full px-4 py-2 text-white'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </span>
    </Form>
  )
}

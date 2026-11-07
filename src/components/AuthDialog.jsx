import { useState } from 'react'
import Modal from './Modal'

const modes = {
  login: { tab: 'Log in', submit: 'Log in', passwordAutocomplete: 'current-password' },
  register: { tab: 'Register', submit: 'Create account', passwordAutocomplete: 'new-password' }
}

function AuthDialog({ initialMode = 'login', onLogin, onRegister, onClose }) {
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const switchTo = (next) => {
    setMode(next)
    setError(null)
  }

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await (mode === 'login' ? onLogin : onRegister)(email, password)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal open onCancel={onClose}>
      <div className='flex gap-4 mb-5 border-b border-gray-700' role='tablist'>
        {Object.entries(modes).map(([key, { tab }]) => (
          <button
            key={key}
            role='tab'
            aria-selected={mode === key}
            onClick={() => switchTo(key)}
            className={`pb-2 -mb-px border-b-2 ${mode === key ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className='flex flex-col gap-4'>
        <label className='flex flex-col gap-1 text-sm'>
          Email
          <input
            type='email'
            required
            autoFocus
            autoComplete='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-gray-900 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500'
          />
        </label>
        <label className='flex flex-col gap-1 text-sm'>
          Password
          <input
            type='password'
            required
            minLength={mode === 'register' ? 8 : undefined}
            maxLength={128}
            autoComplete={modes[mode].passwordAutocomplete}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='bg-gray-900 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500'
          />
          {mode === 'register' && <span className='text-xs text-gray-400'>At least 8 characters</span>}
        </label>
        {error && <p role='alert' className='text-sm text-red-400'>{error}</p>}
        <div className='flex justify-end gap-3 mt-2'>
          <button type='button' onClick={onClose} className='px-4 py-2 rounded text-gray-200 hover:bg-gray-700'>
            Cancel
          </button>
          <button type='submit' disabled={busy} className='px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium'>
            {modes[mode].submit}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AuthDialog

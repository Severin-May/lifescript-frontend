import { useState, useEffect } from 'react'
import * as authApi from '../api/authApi'
import { onUnauthorized } from '../api/http'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    authApi.fetchCsrfToken()
      .then(authApi.currentUser)
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setChecked(true))
  }, [])

  useEffect(() => onUnauthorized(() => setUser(null)), [])

  const login = async (email, password) => setUser(await authApi.login(email, password))
  const register = async (email, password) => setUser(await authApi.register(email, password))
  const logout = async () => {
    await authApi.logout()
    setUser(null)
  }

  return { user, checked, login, register, logout }
}

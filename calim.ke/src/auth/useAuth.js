// useAuth.js provides a custom hook for consuming auth state
// from AuthContext without importing useContext repeatedly.
import { useContext } from 'react'
import { AuthContext } from './AuthContextValue.js'

export function useAuth() {
  return useContext(AuthContext)
}

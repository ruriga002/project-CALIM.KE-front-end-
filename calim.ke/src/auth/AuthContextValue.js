// AuthContextValue.js exports the React context object
// to avoid circular import issues and support stable context usage.
import { createContext } from 'react'

export const AuthContext = createContext(null)

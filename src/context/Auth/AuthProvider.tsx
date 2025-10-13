// src/context/Auth/AuthProvider.ts

import type { FC, PropsWithChildren } from 'react'
import {  useState } from 'react'
import { AuthContext } from './AuthContext'

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username') || null)
    const [token, setToken] = useState<string | null>(localStorage.getItem('token') || null)


    const login = (username: string, token: string) => {
        setUsername(username)
        setToken(token)
        localStorage.setItem('token', token)
        localStorage.setItem('username', username)
    }
    const logout = () => {
        setUsername(null)
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('rememberMe')
        localStorage.removeItem('rememberedEmail')
    }

    return <AuthContext.Provider value={{ username, token, login, logout }}>{children}</AuthContext.Provider>
} 

export default AuthProvider






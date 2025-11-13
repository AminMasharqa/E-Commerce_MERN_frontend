// src/context/Auth/AuthProvider.ts

import type { FC, PropsWithChildren } from 'react'
import {  useState } from 'react'
import { AuthContext } from './AuthContext'

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username') || null)
    const [token, setToken] = useState<string | null>(localStorage.getItem('token') || null)
    const [userId, setUserId] = useState<string | null>(() => {
        // Try to get userId from localStorage first
        const storedUserId = localStorage.getItem('userId')
        if (storedUserId) return storedUserId
        
        // If not found, try to extract from existing token
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
            try {
                const payload = JSON.parse(atob(storedToken.split('.')[1]))
                const extractedUserId = payload.userId || payload.id || payload.sub
                if (extractedUserId) {
                    localStorage.setItem('userId', extractedUserId)
                    return extractedUserId
                }
            } catch (error) {
                console.error('Error decoding existing token:', error)
            }
        }
        return null
    })


    const login = (username: string, token: string) => {
        setUsername(username)
        setToken(token)
        localStorage.setItem('token', token)
        localStorage.setItem('username', username)
        
        // Decode JWT to get userId
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            const extractedUserId = payload.userId || payload.id || payload.sub
            if (extractedUserId) {
                setUserId(extractedUserId)
                localStorage.setItem('userId', extractedUserId)
            }
        } catch (error) {
            console.error('Error decoding token:', error)
        }
    }
    const logout = () => {
        setUsername(null)
        setToken(null)
        setUserId(null)
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('userId')
        localStorage.removeItem('rememberMe')
        localStorage.removeItem('rememberedEmail')
    }

    return <AuthContext.Provider value={{ username, token, userId, login, logout }}>{children}</AuthContext.Provider>
} 

export default AuthProvider






import {createContext, useContext} from "react"

interface AuthContextType {
    username: string | null;
    token: string | null;
    userId: string | null;
    login(username: string, token: string): void;
    logout(): void;

}

const AuthContext = createContext<AuthContextType>({username: null, token: null, userId: null, login: () => {}, logout: () => {}})

export { AuthContext }

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
} 

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);

    const login = (credentials) => {
        setUser({name: 'Riley', role: 'user'});
    };

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
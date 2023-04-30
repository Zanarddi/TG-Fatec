import { useState, createContext } from "react";

export const GlobalContext = createContext();

export default function GlobalProvider({ children }){
    const [auth, setAuth] = useState();
    return(
        <GlobalContext.Provider value={{auth, setAuth}}>
            {children}
        </GlobalContext.Provider>
    )
}
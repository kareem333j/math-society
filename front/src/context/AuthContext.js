import { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = (props) => {
    const [dataProfile, setDataProfile] = useState({
        isAuthenticated: null,
        profile: null,
    });

    return(
        <AuthContext.Provider value={{dataProfile:dataProfile, setDataProfile:setDataProfile}}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
import {
    createContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";


export const AuthContext = createContext();


function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [loading, setLoading] = useState(true);



    useEffect(() => {

        const loadUser = async () => {

            const storedToken =
                localStorage.getItem("token");


            if (!storedToken) {

                setLoading(false);

                return;

            }


            try {

                const response =
                    await api.get("/auth/me");


                setUser(response.data.data);


            } catch (error) {

                localStorage.removeItem("token");

                localStorage.removeItem("user");

                setToken(null);

                setUser(null);

            } finally {

                setLoading(false);

            }

        };


        loadUser();

    }, []);


 

    const login = async (
        email,
        password
    ) => {

        const response =
            await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );


        const responseData =
            response.data.data;


        const newToken =
            responseData.token;

        const loggedInUser =
            responseData.user;


        localStorage.setItem(
            "token",
            newToken
        );

        localStorage.setItem(
            "user",
            JSON.stringify(loggedInUser)
        );


        setToken(newToken);

        setUser(loggedInUser);


        return loggedInUser;

    };



    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setToken(null);

        setUser(null);

    };



    const isAuthenticated =
        Boolean(token && user);


    return (

        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
                isAuthenticated
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}


export default AuthProvider;
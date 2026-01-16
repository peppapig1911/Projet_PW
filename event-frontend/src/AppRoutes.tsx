import {useMemo} from "react";
import {Navigate,Route,Routes} from "react-router-dom"
import type {User} from "./utils/types"
import LoginPage from "./Pages/LoginPage.tsx"
import SignupPage from "./Pages/SignupPage.tsx";
import LogSignPage from "./Pages/LogSignPage.tsx";

type AppRoutesProps={
    user:User |null;
};

export default function AppRoutes({user,}:AppRoutesProps){
    const token = localStorage.getItem("token");
    const isAuthenticated = useMemo(()=>Boolean(token && user),[token,user])

    return(
        <Routes>
            <Route path="/"
                   element={
                       isAuthenticated ?(
                           <Navigate to="/events" replace/>
                       ): (
                           <LogSignPage/>
                       )
                   }
            />

            <Route path="/login"
                   element={
                       isAuthenticated ?(
                           <Navigate to="/events" replace/>
                       ): (
                            <LoginPage/>
                       )
                   }
            />
            <Route path="/signup"
                   element={
                       isAuthenticated ?(
                           <Navigate to="/events" replace/>
                       ): (
                           <SignupPage/>
                       )
                   }
            />
        </Routes>
    )
}
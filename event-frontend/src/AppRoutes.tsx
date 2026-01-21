import {useMemo} from "react";
import {Navigate,Route,Routes} from "react-router-dom"
import type {User} from "./utils/types"
import LoginPage from "./Pages/LoginPage.tsx"
import SignupPage from "./Pages/SignupPage.tsx";
import LogSignPage from "./Pages/LogSignPage.tsx";
import EventHomePage from "./Pages/EventHomePages.tsx";

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
                           <Navigate to="/eventshomepage" replace/>
                       ): (
                           <LogSignPage/>
                       )
                   }
            />

            <Route path="/login"
                   element={
                       isAuthenticated ?(
                           <Navigate to="/eventshomepage" replace/>
                       ): (
                            <LoginPage/>
                       )
                   }
            />
            <Route path="/signup"
                   element={
                       isAuthenticated ?(
                           <Navigate to="/eventshomepage" replace/>
                       ): (
                           <SignupPage/>
                       )
                   }
            />
            <Route path="/eventshomepage"
                element=
                   {
                       isAuthenticated ?(
                           <Navigate to="/" replace/>
                    ):(
                        <EventHomePage/>
                       )
                   }
            />
        </Routes>
    )
}
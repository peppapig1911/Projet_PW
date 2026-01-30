import {useMemo} from "react";
import {Navigate,Route,Routes} from "react-router-dom"
import type {User} from "./utils/types"
import {LogsignForm, SignupPage} from "./Pages/logsign/logsignForm.tsx"
import LogsignPage from "./Pages/logsign/logsignPage.tsx";
import EventHomePage from "./Pages/homePage.tsx";
import EventDetailPage from "./Pages/events/detailPage.tsx";

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
                           <LogsignPage/>
                       )
                   }
            />

            <Route path="/login"
                   element={
                       isAuthenticated ?(
                           <Navigate to="/eventshomepage" replace/>
                       ): (
                            <LogsignForm/>
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

            <Route path="/event/:id"
                element=
                    {
                        isAuthenticated ?(
                            <Navigate to="/" replace/>
                        ):(
                        <EventDetailPage/>
                        )
                    }
            />
        </Routes>
    )
}
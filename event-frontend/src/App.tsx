import './App.css'
import type {User} from "./utils/types"
import {useEffect, useState} from "react";
import AppRoutes from "./AppRoutes.tsx";
import { BrowserRouter } from "react-router-dom";
import {validateToken} from "./API/auth-actions.ts";

export default function App(){
    const [user, setUser]=useState<User |null>(null);
    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(!token){
            return;
        }
        validateToken()
            .then((u: User)=>{
                setUser(u);
            })
            .catch(()=>{
                localStorage.removeItem("token");
                setUser(null);
            })
    },[])

    return(
        <BrowserRouter>
            <AppRoutes user={user}/>
        </BrowserRouter>
    )
}

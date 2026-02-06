import './App.css'
import type { User } from "./utils/types"
import { useEffect, useState } from "react";
import AppRoutes from "./AppRoutes.tsx";
import { BrowserRouter } from "react-router-dom";
import { validateToken } from "./API/auth-actions.ts";
import Navbar from "./Pages/navBar.tsx";

export default function App() {
    const [user, setUser] = useState<User | null>(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        console.log("Tentative de validation avec le token:", token);

        validateToken()
            .then((u: any) => {
                const userData = u.user || u;
                console.log("Validation réussie ! Utilisateur:", userData);
                setUser(userData);
            })
            .catch((err) => {
                console.error("ERREUR DE VALIDATION :", err);

                if (err.message === "Invalid token") {
                    handleLogout();
                }
            });
    }, []);

    return (
        <BrowserRouter>
            <Navbar user={user} onLogout={handleLogout} />
            <AppRoutes user={user} setUser={setUser} />
        </BrowserRouter>
    );
}
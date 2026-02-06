import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LogsignForm, SignupPage } from "./logsignForm.tsx";
// Assure-toi que le chemin vers ton style est le bon
import "../styles/LogSignPage.scss";

interface LogsignPageProps {
    setUser: (user: any) => void;
}

export default function LogsignPage({ setUser }: LogsignPageProps) {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("login");

    // Synchronisation de l'onglet avec l'URL (Login ou Signup)
    useEffect(() => {
        if (location.pathname === "/signup") {
            setActiveTab("signup");
        } else if (location.pathname === "/login") {
            setActiveTab("login");
        }
    }, [location.pathname]);

    return (
        <div className="auth-wrapper">
            <div className="auth-tabs-container">
                {/* C'est cette div 'tabs-header' qui crée le bloc noir avec les boutons dedans */}
                <div className="tabs-header">
                    <button
                        className={activeTab === "login" ? "active" : ""}
                        onClick={() => setActiveTab("login")}
                    >
                        Se Connecter
                    </button>
                    <button
                        className={activeTab === "signup" ? "active" : ""}
                        onClick={() => setActiveTab("signup")}
                    >
                        S'inscrire
                    </button>
                </div>

                <div className="tabs-content">
                    {activeTab === "login" ? (
                        <LogsignForm setUser={setUser} />
                    ) : (
                        <SignupPage onSignupSuccess={() => setActiveTab("login")} />
                    )}
                </div>
            </div>
        </div>
    );
}
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LogsignForm, SignupPage } from "./logsignForm.tsx";
import "../styles/LogSignPage.scss";

interface User {
    id: number;
    username: string;
}

interface LogsignPageProps {
    setUser: (user: User) => void;
}

export default function LogsignPage({ setUser }: LogsignPageProps) {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("login");

   useEffect(() => {
        if (location.pathname === "/signup") {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveTab("signup");
        } else if (location.pathname === "/login") {
            setActiveTab("login");
        }
    }, [location.pathname]);

    return (
        <div className="auth-wrapper">
            <div className="auth-tabs-container">
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
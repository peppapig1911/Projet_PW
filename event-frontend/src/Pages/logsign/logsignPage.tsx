import { useState } from "react";
import { LogsignForm, SignupPage } from "./logsignForm.tsx";
import "../styles/LogSignPage.scss";

export default function LogsignPage() {
    const [activeTab, setActiveTab] = useState("login");

    return (
        <div className="auth-wrapper">
            <div className="auth-tabs-container">
                <div className="tabs-header">
                    <button
                        className={activeTab === "login" ? "active" : ""}
                        onClick={() => setActiveTab("login")}>
                        Se Connecter
                    </button>
                    <button
                        className={activeTab === "signup" ? "active" : ""}
                        onClick={() => setActiveTab("signup")}>
                        S'inscrire
                    </button>
                </div>

                <div className="tabs-content">
                    {activeTab === "login" ? (
                        <LogsignForm />
                    ) : (
                        <SignupPage onSignupSuccess={() => setActiveTab("login")} />
                    )}
                </div>
            </div>
        </div>
    );
}
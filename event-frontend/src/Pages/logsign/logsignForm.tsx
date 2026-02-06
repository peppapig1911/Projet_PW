import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginandSignupPage.scss";

interface LogsignFormProps {
    setUser: (user: any) => void;
}

interface SignupPageProps {
    onSignupSuccess: () => void;
}

export function LogsignForm({ setUser }: LogsignFormProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    useNavigate();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5143/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                setUser(data.user);
                window.location.href = "/";
            } else {
                alert(data.error || "Erreur lors de la connexion");
            }
        } catch (error) {
            console.error("Erreur technique lors du login:", error);
            alert("Impossible de contacter le serveur.");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <input
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                placeholder="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Se Connecter</button>
        </form>
    );
}

// --- COMPOSANT SIGNUP ---
export function SignupPage({ onSignupSuccess }: SignupPageProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5143/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                setIsRegistered(true);
            } else {
                const data = await response.json();
                alert(data.error || "Erreur lors de l'inscription");
            }
        } catch (error) {
            console.error("Erreur technique lors du signup:", error);
        }
    }

    if (isRegistered) {
        return (
            <div className="success-message">
                <h2>✨ Compte créé avec succès !</h2>
                <p>Tu peux maintenant te connecter.</p>
                <button onClick={onSignupSuccess}>Aller à la connexion</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <input
                placeholder="Créer un nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                placeholder="Créer un mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">S'inscrire</button>
        </form>
    );
}
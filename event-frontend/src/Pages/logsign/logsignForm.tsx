import "../styles/LoginandSignupPage.scss"
import { type FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom";


export function LogsignForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5143/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json(); // On récupère la donnée une seule fois

            if (response.ok) {
                // Stocker le token avant de naviguer
                localStorage.setItem("token", data.token);
                navigate("/eventshomepage");
            } else {
                alert(data.error || "Erreur lors de la connexion");
            }
        } catch (error) {
            console.error(error);
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


export function SignupPage({onSignupSuccess}: { onSignupSuccess?: () => void }) {
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
            console.error(error);
        }
    }

    if (isRegistered) {
        return (
            <div className="success-message">
                <h2>Compte créé avec succès !</h2>
                <button onClick={onSignupSuccess}>Se connecter maintenant</button>
            </div>
        );
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
            <button type="submit">S'inscrire</button>
        </form>
    );
}
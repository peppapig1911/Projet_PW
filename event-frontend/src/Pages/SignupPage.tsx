import "./styles/LoginandSignupPage.scss"
import { type FormEvent, useState } from "react";

export default function SignupPage({onSignupSuccess}: { onSignupSuccess?: () => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        console.log(username,password)
        try {
            const response = await fetch("http://localhost:5143/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                setIsRegistered(true);
            } else {
                const data = await response.json();
                alert(data.error);
            }
        } catch (error) {
            console.error(error);
        }
    }
    if (isRegistered) {
        return (
            <div className="success-message">
                <h2>Compte créé</h2>
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
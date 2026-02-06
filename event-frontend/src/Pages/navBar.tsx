import { Link, useNavigate } from "react-router-dom";
import type { User } from "../utils/types";
import "./styles/navbar.scss";

interface NavbarProps {
    user: User | null;
    onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
    const navigate = useNavigate();

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        onLogout();
        navigate("/");
    };

    return (
        <nav className="main-navbar">
            <div className="nav-left">
                <Link to="/" className="nav-btn">Accueil</Link>
            </div>

            <div className="nav-right">
                {user ? (
                    // Cas connecté
                    <div className="user-controls">
                        <Link to="/profile" className="nav-btn">
                            Mon profil
                        </Link>
                        <button onClick={handleLogout} className="nav-btn">
                            Me déconnecter
                        </button>
                    </div>
                ) : (
                    // Cas déconnecté
                    <div className="auth-links">
                        <Link to="/login" className="nav-btn">Connexion</Link>
                        <span className="separator">|</span>
                        <Link to="/signup" className="nav-btn">Inscription</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
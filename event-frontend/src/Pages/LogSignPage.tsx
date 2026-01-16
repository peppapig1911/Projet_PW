import "./styles/LogSignPage.scss"
import { Link } from "react-router-dom";

export default function LogSignPage() {
    return (
        <form>
                <Link to="/login">
                    <button type="button">Se connecter</button>
                </Link>

                <Link to="/signup">
                    <button type="submit">S'inscrire</button>
                </Link>
        </form>
    );
}
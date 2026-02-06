import "../styles/eventCard.scss";
import { Link } from "react-router-dom";

interface Event {
    event_id: number;
    owner_id: number;
    title: string;
    description: string;
    full_description: string;
    image_url: string;
    max_participants: number;
    event_date: string;
    nb_suscribers: number;
    is_registered?: boolean;
}

interface EventCardProps {
    event: Event;
    currentUserId: number | null;
    onStatusChange: (updatedEvent: Event) => void;
    onDelete: (eventId: number) => void;
    onEdit: (event: Event) => void;
}

export default function EventCard({ event, currentUserId, onStatusChange, onDelete, onEdit }: EventCardProps) {

    const handleToggleSubscription = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const rawToken = localStorage.getItem("token");
        const token = rawToken ? rawToken.replace(/^"|"$/g, '') : null;

        if (!token) {
            alert("Vous devez être connecté pour vous inscrire.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5143/api/events/${event.event_id}/toggle-subscribe`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error("Erreur réseau");

            const data = await response.json();

            onStatusChange({
                ...event,
                is_registered: data.subscribed,
                nb_suscribers: data.nb_suscribers
            });
        } catch (err) {
            console.error("Erreur toggle:", err);
            alert("Impossible de mettre à jour votre inscription.");
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!window.confirm("Es-tu sûr de vouloir supprimer cet événement ?")) return;

        const rawToken = localStorage.getItem("token");
        const token = rawToken ? rawToken.replace(/^"|"$/g, '') : null;

        try {
            const response = await fetch(`http://localhost:5143/api/events/${event.event_id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                onDelete(event.event_id);
            } else {
                alert("Erreur lors de la suppression");
            }
        } catch (err) {
            alert("Impossible de joindre le serveur");
        }
    };

    const isFull = event.nb_suscribers >= event.max_participants;

    return (
        <div className="event-card">
            {currentUserId === event.owner_id && (
                <div className="admin-actions">
                    <button className="edit-btn" onClick={() => onEdit(event)}>✏️</button>
                    <button className="delete-icon" onClick={handleDelete}>&times;</button>
                </div>
            )}

            {event.image_url && (
                <div className="event-image-container">
                    <img
                        src={event.image_url}
                        alt={event.title}
                        className="event-img"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://picsum.photos/400/200?grayscale"; // Image de secours
                        }}
                    />
                </div>
            )}

            <div className="event-content">
                <h3>{event.title}</h3>
                <Link to={`/event/${event.event_id}`} className="detail-link">Afficher le détail</Link>

                <p className="event-date-display">
                    {event.event_date ? new Date(event.event_date).toLocaleDateString('fr-FR') : 'Date non définie'}
                </p>

                <p className="event-description">{event.description}</p>

                <div className="event-footer">
                    <span className="subscriber-count">
                        {event.nb_suscribers} / {event.max_participants} inscrits
                    </span>

                    {event.is_registered ? (
                        <button
                            className="unregister-btn"
                            onClick={handleToggleSubscription}
                        >
                            Se désinscrire
                        </button>
                    ) : (
                        <button
                            className="register-btn"
                            onClick={handleToggleSubscription}
                            disabled={isFull}
                        >
                            {isFull ? "Complet" : "S'inscrire"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
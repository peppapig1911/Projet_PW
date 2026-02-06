import "../styles/eventCard.scss";
import { Link } from "react-router-dom";

export default function EventCard({ event, currentUserId, onStatusChange, onDelete, onEdit }: any) {
    const handleToggleSubscription = async (e: React.MouseEvent) => {
        e.preventDefault();
        const rawToken = localStorage.getItem("token");
        const token = rawToken ? rawToken.replace(/^"|"$/g, '') : null;
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:5143/api/events/${event.event_id}/toggle-subscribe`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            onStatusChange({ ...event, is_registered: data.subscribed, nb_suscribers: data.nb_suscribers });
        } catch (err) { console.error(err); }
    };

    const isFull = event.nb_suscribers >= event.max_participants;

    return (
        <div className="event-card">
            {currentUserId === event.owner_id && (
                <div className="admin-actions">
                    <button className="edit-btn" onClick={() => onEdit(event)}>✏️</button>
                    <button className="delete-icon" onClick={() => onDelete(event.event_id)}>&times;</button>
                </div>
            )}

            <div className="event-image-container">
                <img
                    src={event.image_url || "https://picsum.photos/400/200"}
                    alt={event.title}
                    className="event-img"
                />
            </div>

            <div className="event-content">
                <h3 className="event-title">{event.title}</h3>

                <Link to={`/event/${event.event_id}`} className="detail-link">Afficher le détail</Link>

                <div className="event-info-row">
                    {event.location && (
                        <span className="event-location-display">
                            <span className="pin-icon">📍</span> {event.location}
                        </span>
                    )}
                    <span className="event-date-display">
                        {new Date(event.event_date).toLocaleDateString()}
                    </span>
                </div>

                <p className="event-description">{event.description}</p>

                <div className="event-footer">
                    <span className="subscriber-count">{event.nb_suscribers} / {event.max_participants} inscrits</span>
                    <button
                        className={event.is_registered ? "unregister-btn" : "register-btn"}
                        onClick={handleToggleSubscription}
                        disabled={!event.is_registered && isFull}
                    >
                        {event.is_registered ? "Se désinscrire" : (isFull ? "Complet" : "S'inscrire")}
                    </button>
                </div>
            </div>
        </div>
    );
}
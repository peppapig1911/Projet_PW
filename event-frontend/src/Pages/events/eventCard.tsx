import { eventsubActions } from "../../API/eventsub-actions";
import "../styles/eventCard.scss";
import { Link } from "react-router-dom";

interface Event {
    event_id: number;
    owner_id: number;
    title: string;
    description: string;
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

    const handleRegister = async () => {
        try {
            const actions = await eventsubActions();
            const updatedEvent = await actions.register(event.event_id);
            onStatusChange({ ...updatedEvent, is_registered: true });
        } catch (err) {
            alert("Erreur d'inscription");
        }
    };

    const handleUnregister = async () => {
        try {
            const actions = await eventsubActions();
            const updatedEvent = await actions.unregister(event.event_id);
            onStatusChange({ ...updatedEvent, is_registered: false });
        } catch (err) {
            alert("Erreur de désinscription");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Es-tu sûr de vouloir supprimer cet événement ?")) return;
        const rawToken = localStorage.getItem("token");
        const token = rawToken ? rawToken.replace(/^"|"$/g, '') : null;

        try {
            const response = await fetch(`http://localhost:5143/api/events/${event.event_id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) onDelete(event.event_id);
        } catch (err) {
            alert("Impossible de joindre le serveur");
        }
    };

    return (
        <div className="event-card">
            {currentUserId === event.owner_id && (
                <div className="admin-actions">
                    <button className="edit-btn" onClick={() => onEdit(event)}>✏️</button>
                    <button className="delete-icon" onClick={handleDelete}>&times;</button>
                </div>
            )}

            <div className="event-content">
                <h3>{event.title}</h3>
                <Link to={`/event/${event.event_id}`} className="detail-link">Afficher le détail</Link>
                <p className="event-date-display">{event.event_date ? new Date(event.event_date).toLocaleDateString('fr-FR') : 'Date non définie'}</p>
                <p>{event.description}</p>
                <div className="event-footer">
                    <span>{event.nb_suscribers} / {event.max_participants} inscrits</span>
                    {event.is_registered ? (
                        <button className="unregister-btn" onClick={handleUnregister}>Se désinscrire</button>
                    ) : (
                        <button className="register-btn" onClick={handleRegister} disabled={event.nb_suscribers >= event.max_participants}>
                            {event.nb_suscribers >= event.max_participants ? "Complet" : "S'inscrire"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
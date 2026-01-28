import { eventsubActions } from "../../API/eventsub-actions";

interface Event {
    event_id: number;
    title: string;
    description: string;
    max_participants: number;
    event_date: string;
    nb_suscribers: number;
    is_registered?: boolean;
}

interface EventCardProps {
    event: Event;
    onStatusChange: (updatedEvent: Event) => void;
}

export default function EventCard({ event, onStatusChange }: EventCardProps) {

    const handleRegister = async () => {
        try {
            const actions = await eventsubActions();
            const updatedEvent = await actions.register(event.event_id);

            // On force is_registered à true car le serveur ne le renvoie pas forcément dans l'objet event
            onStatusChange({ ...updatedEvent, is_registered: true });
        } catch (err) {
            alert("Erreur d'inscription");
        }
    };

    const handleUnregister = async () => {
        try {
            const actions = await eventsubActions();
            const updatedEvent = await actions.unregister(event.event_id);

            // On force is_registered à false
            onStatusChange({ ...updatedEvent, is_registered: false });
        } catch (err) {
            alert("Erreur de désinscription");
        }
    };

    return (
        <div className="event-card">
            <div className="event-content">
                <h3>{event.title}</h3>
                <p className="event-date-display">
                    {event.event_date ? new Date(event.event_date).toLocaleDateString('fr-FR') : 'Date non définie'}
                </p>
                <p>{event.description}</p>
                <div className="event-footer">
                    <span>{event.nb_suscribers} / {event.max_participants} inscrits</span>

                    {event.is_registered ? (
                        <button className="unregister-btn" onClick={handleUnregister}>
                            Se désinscrire
                        </button>
                    ) : (
                        <button
                            className="register-btn"
                            onClick={handleRegister}
                            disabled={event.nb_suscribers >= event.max_participants}
                        >
                            {event.nb_suscribers >= event.max_participants ? "Complet" : "S'inscrire"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
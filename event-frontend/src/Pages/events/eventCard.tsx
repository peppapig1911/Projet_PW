import eventSubscription from "./eventSubscription.tsx";

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
    const subscriptionService = eventSubscription();

    const handleRegister = async () => {
        try {
            const updatedEvent = await subscriptionService.register(event.event_id);
            onStatusChange({ ...updatedEvent, is_registered: true });
        } catch (err) {
            alert("Erreur d'inscription");
        }
    };

    const handleUnregister = async () => {
        try {
            const updatedEvent = await subscriptionService.unregister(event.event_id);
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
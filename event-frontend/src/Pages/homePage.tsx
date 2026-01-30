import { useEffect, useState } from "react";
import "./styles/homePage.scss";
import EventCard from "./events/eventCard.tsx";

interface Event {
    event_id: number;
    owner_id: number;
    title: string;
    description: string;
    max_participants: number;
    event_date: string;
    nb_suscribers : number;
    is_registered?: boolean;
}

export default function EventHomePage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [maxParticipants, setMaxParticipants] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    useEffect(() => {
        const rawToken = localStorage.getItem("token");
        const savedToken = rawToken ? rawToken.replace(/^"|"$/g, '') : null;

        if (savedToken) {
            try {
                const payload = JSON.parse(atob(savedToken.split('.')[1]));
                setCurrentUserId(payload.id);
            } catch (e) {
                console.error("Erreur décodage token", e);
            }
        }

        fetch("http://localhost:5143/api/events", {
            method: "GET",
            headers: {
                "Authorization": savedToken ? `Bearer ${savedToken}` : ""
            }
        })
            .then(res => res.json())
            .then(data => {
                setEvents(Array.isArray(data) ? data : []);
            })
            .catch(err => console.error("Erreur chargement events:", err));
    }, []);

    const updateEventInList = (updatedEvent: Event) => {
        setEvents(prevEvents =>
            prevEvents.map(e =>
                e.event_id === updatedEvent.event_id
                    ? { ...e, ...updatedEvent }
                    : e
            )
        );
    };

    const removeEventFromList = (eventId: number) => {
        setEvents(prevEvents => prevEvents.filter(e => e.event_id !== eventId));
    };

    const openEditModal = (event: Event) => {
        setEditingEvent(event);
        setTitle(event.title);
        setDescription(event.description);
        setMaxParticipants(event.max_participants.toString());
        setEventDate(new Date(event.event_date).toISOString().split('T')[0]);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingEvent(null);
        setTitle("");
        setDescription("");
        setEventDate("");
        setMaxParticipants("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const rawToken = localStorage.getItem("token");
        const savedToken = rawToken ? rawToken.replace(/^"|"$/g, '') : null;

        if (!savedToken) {
            alert("Session expirée. Veuillez vous reconnecter.");
            return;
        }

        const isEditing = !!editingEvent;
        const url = isEditing
            ? `http://localhost:5143/api/events/${editingEvent?.event_id}`
            : "http://localhost:5143/api/events";

        const method = isEditing ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${savedToken}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    max_participants: Number(maxParticipants),
                    event_date: eventDate
                }),
            });

            const data = await response.json();

            if (response.ok) {
                if (isEditing) {
                    setEvents(prevEvents =>
                        prevEvents.map(ev => ev.event_id === data.event_id ? { ...ev, ...data } : ev)
                    );
                } else {
                    setEvents([data, ...events]);
                }
                closeModal();
            } else {
                alert(`Erreur : ${data.error || "Problème lors de l'opération"}`);
            }
        } catch (error) {
            alert("Impossible de contacter le serveur.");
        }
    };

    return (
        <div className="events-container">
            <header className="events-header">
                <h1>Nos Événements</h1>
                <p>Inscrivez-vous à nos ateliers</p>
                <button className="add-event-btn" onClick={() => setIsModalOpen(true)}>
                    + Créer un événement
                </button>
            </header>

            <div className="events-grid">
                {events.length > 0 ? (
                    events.map((event) => (
                        <EventCard
                            key={event.event_id}
                            event={event}
                            currentUserId={currentUserId}
                            onStatusChange={updateEventInList}
                            onDelete={removeEventFromList}
                            onEdit={openEditModal}
                        />
                    ))
                ) : (
                    <p>Aucun événement disponible pour le moment.</p>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingEvent ? "Modifier l'événement" : "Nouvel Événement"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Titre :</label>
                                <input value={title} onChange={e => setTitle(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Description :</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Date :</label>
                                <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Participants max :</label>
                                <input type="number" value={maxParticipants} onChange={e => setMaxParticipants(e.target.value)} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={closeModal}>Annuler</button>
                                <button type="submit" className="confirm-btn">
                                    {editingEvent ? "Enregistrer" : "Publier"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
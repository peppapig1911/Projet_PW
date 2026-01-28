import { useEffect, useState } from "react";
import "./styles/EventsHomePage.scss";
import EventCard from "./events/eventCard.tsx";

interface Event {
    event_id: number;
    title: string;
    description: string;
    max_participants: number;
    event_date: string;
    nb_suscribers : number;
    is_registered?: boolean;
}

export default function EventHomePage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [maxParticipants, setMaxParticipants] = useState("");
    const [eventDate, setEventDate] = useState("");

    useEffect(() => {
        const rawToken = localStorage.getItem("token");
        const savedToken = rawToken ? rawToken.replace(/^"|"$/g, '') : null;

        // --- AJOUTE CE LOG ---
        console.log("Token envoyé au chargement :", savedToken);

        fetch("http://localhost:5143/api/events", {
            method: "GET",
            headers: {
                // Assure-toi qu'il n'y a pas d'espace en trop ou de faute de frappe
                "Authorization": savedToken ? `Bearer ${savedToken}` : ""
            }
        })
            .then(res => res.json())
            .then(data => {
                // Si data est un tableau, on met à jour, sinon on initialise à vide
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const rawToken = localStorage.getItem("token");
        const savedToken = rawToken ? rawToken.replace(/^"|"$/g, '') : null;

        if (!savedToken) {
            alert("Session expirée. Veuillez vous reconnecter.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5143/api/events", {
                method: "POST",
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
                setEvents([data, ...events]);
                setIsModalOpen(false);
                setTitle(""); setDescription(""); setEventDate(""); setMaxParticipants("");
            } else {
                alert(`Erreur : ${data.error || "Problème lors de la création"}`);
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
                            onStatusChange={updateEventInList}
                        />
                    ))
                ) : (
                    <p>Aucun événement disponible pour le moment.</p>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Nouvel Événement</h2>
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
                                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Annuler</button>
                                <button type="submit" className="confirm-btn">Publier</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
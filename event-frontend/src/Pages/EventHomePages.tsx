import { useEffect, useState } from "react";
import "./styles/EventsHomePage.scss";

interface Event {
    event_id: number;
    title: string;
    description: string;
    nb_suscribers: number;
    max_participants: number;
    event_date: string;
}

export default function EventHomePage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Déclaration des variables pour le formulaire
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [maxParticipants, setMaxParticipants] = useState("");
    const [eventDate, setEventDate] = useState("");

    // Charger les événements au démarrage
    useEffect(() => {
        fetch("http://localhost:5143/api/events")
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(err => console.error("Erreur chargement events:", err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Récupération du token
        const savedToken = localStorage.getItem("token");

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
                    max_participants: maxParticipants,
                    event_date: eventDate
                }),
            });

            const data = await response.json();
            console.log("Statut HTTP :", response.status);
            console.log("Réponse du serveur :", data);

            if (response.ok) {
                setEvents([data, ...events]);
                setIsModalOpen(false);
                // Reset du formulaire
                setTitle("");
                setDescription("");
                setEventDate("");
                setMaxParticipants("");
            } else {
                alert(`Erreur : ${data.error || "Problème lors de la création"}`);
            }
        } catch (error) {
            console.error("Erreur lors de l'appel API :", error);
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
                {events.map((event) => (
                    <div key={event.event_id} className="event-card">
                        <div className="event-content">
                            <h3>{event.title}</h3>
                            <p className="event-date-display">
                                {event.event_date ? new Date(event.event_date).toLocaleDateString('fr-FR') : 'Date non définie'}
                            </p>
                            <p>{event.description}</p>
                            <div className="event-footer">
                                <span>{event.nb_suscribers} / {event.max_participants} inscrits</span>
                                <button className="register-btn">S'inscrire</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Nouvel Événement</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Titre de l'événement :</label>
                                <input
                                    placeholder="Titre de l'atelier"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description :</label>
                                <textarea
                                    placeholder="Description"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Date de l'événement :</label>
                                <input
                                    type="date"
                                    value={eventDate}
                                    onChange={e => setEventDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Nombre max de participants :</label>
                                <input
                                    type="number"
                                    value={maxParticipants}
                                    onChange={e => setMaxParticipants(e.target.value)}
                                />
                            </div>

                            <div className="modal-actions">
                                {/* type="button" est important ici pour ne pas envoyer le formulaire */}
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
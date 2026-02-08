import { useEffect, useState } from "react";
import "./styles/homePage.scss";
import EventCard from "./events/eventCard.tsx";
import EventModal from "./events/eventModal";

export default function EventHomePage({ user }: any) {
    const [events, setEvents] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any | null>(null);

    const fetchEvents = () => {
        const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
        fetch("http://localhost:5143/api/events", {
            headers: { "Authorization": token ? `Bearer ${token}` : "" }
        })
            .then(res => res.json())
            .then(data => setEvents(Array.isArray(data) ? data : []));
    };

    // NOUVELLE FONCTION DE SUPPRESSION
    const handleDelete = async (eventId: number) => {
        if (!window.confirm("Supprimer cet événement ?")) return;

        const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
        try {
            const res = await fetch(`http://localhost:5143/api/events/${eventId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                fetchEvents();
            } else {
                alert("Erreur lors de la suppression");
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchEvents(); }, [user]);
    const handleModalSubmit = async (eventData: any) => {
        const token = localStorage.getItem("token")?.replace(/^"|"$/g, '');
        const isEditing = !!editingEvent;
        const url = isEditing ? `http://localhost:5143/api/events/${editingEvent?.event_id}` : "http://localhost:5143/api/events";

        const response = await fetch(url, {
            method: isEditing ? "PUT" : "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(eventData),
        });

        if (response.ok) {
            fetchEvents();
            setIsModalOpen(false);
            setEditingEvent(null);
        }
    };

    return (
        <div className="events-container">
            <header className="events-header">
                <h1>Nos Événements</h1>
                {user && <button className="add-event-btn" onClick={() => { setEditingEvent(null); setIsModalOpen(true); }}>+ Créer un événement</button>}
            </header>
            <div className="events-grid">
                {events.map(event => (
                    <EventCard
                        key={event.event_id}
                        event={event}
                        currentUserId={user ? Number(user.id) : null}
                        onStatusChange={fetchEvents}
                        onDelete={handleDelete}
                        onEdit={(ev: any) => { setEditingEvent(ev); setIsModalOpen(true); }}
                    />
                ))}
            </div>
            <EventModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingEvent(null); }} onSubmit={handleModalSubmit} initialData={editingEvent} />
        </div>
    );
}
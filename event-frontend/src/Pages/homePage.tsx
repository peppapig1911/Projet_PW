import { useEffect, useState } from "react";
import "./styles/homePage.scss";
import EventCard from "./events/eventCard.tsx";
import EventModal from "./events/eventModal.tsx";
import type { User } from "../utils/types";

export default function EventHomePage({ user }: { user: User | null }) {
    const [events, setEvents] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token")?.replace(/^"|"$/g, '');
        fetch("http://localhost:5143/api/events", {
            headers: { "Authorization": token ? `Bearer ${token}` : "" }
        })
            .then(res => res.json())
            .then(data => setEvents(Array.isArray(data) ? data : []))
            .catch(err => console.error(err));
    }, [user]);

    const handleModalSubmit = async (eventData: any) => {
        const token = localStorage.getItem("token")?.replace(/^"|"$/g, '');
        const isEditing = !!editingEvent;
        const url = isEditing ? `http://localhost:5143/api/events/${editingEvent?.event_id}` : "http://localhost:5143/api/events";

        try {
            const response = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(eventData),
            });
            const data = await response.json();
            if (response.ok) {
                if (isEditing) {
                    setEvents(prev => prev.map(ev => ev.event_id === data.event_id ? { ...ev, ...data } : ev));
                } else {
                    setEvents(prev => [data, ...prev]);
                }
                setIsModalOpen(false);
                setEditingEvent(null);
            }
        } catch (error) { console.error(error); }
    };

    return (
        <div className="events-container">
            <header className="events-header">
                <h1>Nos Événements</h1>
                {user && <button className="add-event-btn" onClick={() => { setEditingEvent(null); setIsModalOpen(true); }}>+ Créer un événement</button>}
            </header>
            <div className="events-grid">
                {events.map(event => (
                    <EventCard key={event.event_id} event={event} currentUserId={user ? Number(user.id) : null} onStatusChange={(upd: any) => setEvents(prev => prev.map(e => e.event_id === upd.event_id ? upd : e))} onDelete={(id: any) => setEvents(prev => prev.filter(e => e.event_id !== id))} onEdit={(ev: any) => { setEditingEvent(ev); setIsModalOpen(true); }} />
                ))}
            </div>
            <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} initialData={editingEvent} />
        </div>
    );
}
import { useEffect, useState } from "react";
import type { User } from "../utils/types";
import EventCard from "./events/eventCard";
import EventModal from "./events/eventModal.tsx";
import "./styles/profilePage.scss";

interface ProfilePageProps {
    user: User | null;
}

export default function ProfilePage({ user }: ProfilePageProps) {
    const [myEvents, setMyEvents] = useState<any[]>([]);
    const [joinedEvents, setJoinedEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any | null>(null);

    const handleStatusChange = (updatedEvent: any) => {
        const update = (prev: any[]) => prev.map(e => e.event_id === updatedEvent.event_id ? updatedEvent : e);
        setMyEvents(update);
        setJoinedEvents(update);
    };

    const handleDelete = (eventId: number) => {
        setMyEvents(prev => prev.filter(e => e.event_id !== eventId));
        setJoinedEvents(prev => prev.filter(e => e.event_id !== eventId));
    };

    const handleEdit = (event: any) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (eventData: any) => {
        const token = localStorage.getItem("token")?.replace(/^"|"$/g, '');
        try {
            const response = await fetch(`http://localhost:5143/api/events/${editingEvent.event_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(eventData),
            });

            if (response.ok) {
                const updated = await response.json();
                handleStatusChange(updated);
                setIsModalOpen(false);
            }
        } catch (error) { console.error("Erreur modification:", error); }
    };

    useEffect(() => {
        if (!user) return;
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token")?.replace(/^"|"$/g, '');
                const res = await fetch("http://localhost:5143/api/events", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data: any[] = await res.json();
                const created = data.filter(e => String(e.owner_id || e.creatorId) === String(user.id));
                const joined = data.filter(e => e.is_registered === true || e.participants?.some((p: any) => String(p?.id || p) === String(user.id)));
                setMyEvents(created);
                setJoinedEvents(joined);
            } catch (error) { console.error(error); } finally { setIsLoading(false); }
        };
        fetchUserData();
    }, [user]);

    if (!user) return <div className="profile-container">Connexion requise...</div>;
    if (isLoading) return <div className="profile-container">Chargement... </div>;

    return (
        <div className="profile-container">
            <header className="profile-header">
                <h1>Mon Profil</h1>
            </header>
            <div className="profile-content">
                <section className="event-section">
                    <h2>Mes évènements créés</h2>
                    <div className="event-grid">
                        {myEvents.map(event => (
                            <EventCard key={event.event_id} event={event} currentUserId={Number(user.id)} onStatusChange={handleStatusChange} onDelete={handleDelete} onEdit={handleEdit} />
                        ))}
                    </div>
                </section>
                <section className="event-section">
                    <h2>Mes Inscriptions</h2>
                    <div className="event-grid">
                        {joinedEvents.map(event => (
                            <EventCard key={event.event_id} event={event} currentUserId={Number(user.id)} onStatusChange={handleStatusChange} onDelete={handleDelete} onEdit={handleEdit} />
                        ))}
                    </div>
                </section>
            </div>
            <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} initialData={editingEvent} />
        </div>
    );
}
import { useEffect, useState } from "react";
import EventCard from "./events/eventCard";
import EventModal from "./events/eventModal";
import "./styles/profilePage.scss";

export default function ProfilePage({ user }: any) {
    const [myEvents, setMyEvents] = useState<any[]>([]);
    const [joinedEvents, setJoinedEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any | null>(null);

    const fetchUserData = async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem("token")?.replace(/^"|"$/g, '');
            const res = await fetch("http://localhost:5143/api/events", {
                headers: { Authorization: token ? `Bearer ${token}` : "" }
            });
            const data: any[] = await res.json();
            setMyEvents(data.filter(e => String(e.owner_id || e.creatorId) === String(user.id)));
            setJoinedEvents(data.filter(e => e.is_registered === true || e.participants?.some((p: any) => String(p?.id || p) === String(user.id))));
        } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };

    useEffect(() => { fetchUserData(); }, [user]);

    const handleModalSubmit = async (eventData: any) => {
        const token = localStorage.getItem("token")?.replace(/^"|"$/g, '');
        const response = await fetch(`http://localhost:5143/api/events/${editingEvent.event_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(eventData),
        });
        if (response.ok) {
            fetchUserData();
            setIsModalOpen(false);
        }
    };

    if (!user) return <div className="profile-container">Connexion requise...</div>;
    if (isLoading) return <div className="profile-container">Chargement...</div>;

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
                            <EventCard key={event.event_id} event={event} currentUserId={Number(user.id)} onStatusChange={fetchUserData} onDelete={fetchUserData} onEdit={(ev: any) => { setEditingEvent(ev); setIsModalOpen(true); }} />
                        ))}
                    </div>
                </section>
                <section className="event-section">
                    <h2>Mes Inscriptions</h2>
                    <div className="event-grid">
                        {joinedEvents.map(event => (
                            <EventCard key={event.event_id} event={event} currentUserId={Number(user.id)} onStatusChange={fetchUserData} onDelete={fetchUserData} onEdit={(ev: any) => { setEditingEvent(ev); setIsModalOpen(true); }} />
                        ))}
                    </div>
                </section>
            </div>
            <EventModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingEvent(null); }} onSubmit={handleModalSubmit} initialData={editingEvent} />
        </div>
    );
}
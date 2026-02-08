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
            const token = localStorage.getItem("token")?.replace(/['"]+/g, '');

            const res = await fetch("http://localhost:5143/api/events", {
                headers: { Authorization: token ? `Bearer ${token}` : "" }
            });
            const data: any[] = await res.json();

            if (Array.isArray(data)) {
                // Filtrer les événements créés par l'utilisateur
                setMyEvents(data.filter(e => String(e.owner_id) === String(user.id)));
                setJoinedEvents(data.filter(e => e.is_user_subscribed === true));
            }
        } catch (error) {
            console.error("Erreur Profil:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (eventId: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet événement ?")) return;

        const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
        try {
            const res = await fetch(`http://localhost:5143/api/events/${eventId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                fetchUserData();
            }
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchUserData(); }, [user]);

    const handleModalSubmit = async (eventData: any) => {
        const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
        if (!editingEvent) return;

        const response = await fetch(`http://localhost:5143/api/events/${editingEvent.event_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(eventData),
        });

        if (response.ok) {
            fetchUserData();
            setIsModalOpen(false);
            setEditingEvent(null);
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
                        {myEvents.length > 0 ? (
                            myEvents.map(event => (
                                <EventCard
                                    key={event.event_id}
                                    event={event}
                                    currentUserId={Number(user.id)}
                                    onStatusChange={fetchUserData}
                                    onDelete={fetchUserData}
                                    onEdit={(ev: any) => { setEditingEvent(ev); setIsModalOpen(true); }}
                                />
                            ))
                        ) : <p>Vous n'avez créé aucun événement.</p>}
                    </div>
                </section>

                <section className="event-section">
                    <h2>Mes Inscriptions</h2>
                    <div className="event-grid">
                        {joinedEvents.length > 0 ? (
                            joinedEvents.map(event => (
                                <EventCard
                                    key={event.event_id}
                                    event={event}
                                    currentUserId={Number(user.id)}
                                    onStatusChange={fetchUserData}
                                    onDelete={handleDelete}
                                    onEdit={(ev: any) => { setEditingEvent(ev); setIsModalOpen(true); }}
                                />
                            ))
                        ) : <p>Vous n'êtes inscrit à aucun atelier.</p>}
                    </div>
                </section>
            </div>
            <EventModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingEvent(null); }}
                onSubmit={handleModalSubmit}
                initialData={editingEvent}
            />
        </div>
    );
}
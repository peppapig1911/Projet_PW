import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/detailPage.scss";

export default function EventDetailPage() {
    const { id } = useParams();
    const [event, setEvent] = useState<any>(null);
    const [showParticipants, setShowParticipants] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const rawToken = localStorage.getItem('token');
        const token = rawToken ? rawToken.replace(/^"|"$/g, '') : null;

        fetch(`http://localhost:5143/api/events/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setEvent(data))
            .catch(err => console.error("Erreur detail:", err));
    }, [id]);

    const handleSubscription = async () => {
        const rawToken = localStorage.getItem('token');
        const token = rawToken ? rawToken.replace(/^"|"$/g, '') : null;
        try {
            const response = await fetch(`http://localhost:5143/api/events/${id}/toggle-subscribe`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            const data = await response.json();

            setEvent({
                ...event,
                is_user_subscribed: data.subscribed,
                nb_suscribers: data.nb_suscribers,
                participants_list: data.participants_list
            });
        } catch (err) {
            console.error("Erreur:", err);
        }
    };

    if (!event) return <div className="loading-rose">Chargement de votre événement...</div>;

    return (
        <div className="layout">
            <div className="content-wrapper">
                <main className="main-column">
                    <nav className="breadcrumb-rose" onClick={() => navigate(-1)}>← Revenir aux événements</nav>

                    {event.image_url && (
                        <div className="detail-image-banner">
                            <img src={event.image_url} alt={event.title} />
                        </div>
                    )}

                    <div className="event">
                        <span className="location-tag">Nantes</span>
                        <h1>{event.title}</h1>
                        <p className="short-summary">{event.description}</p>
                    </div>

                    <div className="white-card-section">
                        <h2>Description de l'atelier</h2>
                        <div className="description-rose">
                            {event.full_description && event.full_description.trim() !== "" ? (
                                event.full_description.split('\n').map((line: string, i: number) => (
                                    <p key={i}>{line}</p>
                                ))
                            ) : (
                                <p>Aucune description détaillée fournie.</p>
                            )}
                        </div>
                    </div>
                </main>

                <aside className="sidebar-rose">
                    <div className="sticky-booking-rose">
                        <div className="availability-card">
                            <span className="label-rose">Disponibilités</span>
                            <div className="places-left">
                                {event.max_participants - event.nb_suscribers} places restantes
                            </div>
                            <button className="view-participants-link" onClick={() => setShowParticipants(true)}>
                                Voir la liste des {event.nb_suscribers} participants
                            </button>
                        </div>
                        <button
                            className={`btn-action ${event.is_user_subscribed ? 'is-subscribed' : ''}`}
                            onClick={handleSubscription}
                        >
                            {event.is_user_subscribed ? "Se désinscrire" : "M'inscrire à l'atelier"}
                        </button>
                    </div>
                </aside>
            </div>

            {showParticipants && (
                <div className="modal-overlay" onClick={() => setShowParticipants(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setShowParticipants(false)}>×</button>
                        <h3>Participants ({event.nb_suscribers})</h3>
                        <ul className="participants-list">
                            {event.participants_list?.length > 0 ? (
                                event.participants_list.map((u: string, i: number) => (
                                    <li key={i} className="participant-item">🌸 {u}</li>
                                ))
                            ) : (
                                <li className="participant-item">Aucun inscrit pour le moment</li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
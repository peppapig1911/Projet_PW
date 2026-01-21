import "./styles/EventsHomePage.scss"

export default function EventHomePage() {
    const events = [
        { id: 1, title: "Atelier poterie", description: "Venez découvrir le travail de l'argile et créez vos propres pièces." +
                "22/04/2026" },
        { id: 2, title: "Atelier maroquinerie", description: "Apprenez les techniques de découpe et d'assemblage du cuir." }
    ];

    return (
        <div className="events-container">
            <header className="events-header">
                <h1>Nos Événements</h1>
                <p>Inscrivez-vous à nos ateliers</p>
            </header>

            <div className="events-grid">
                {events.map((event) => (
                    <div key={event.id} className="event-card">
                        <div className="event-content">
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
                            <button className="register-btn">S'inscrire</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
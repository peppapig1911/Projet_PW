import { useState, useEffect } from "react";

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (eventData: any) => void;
    initialData?: any;
}

export default function EventModal({ isOpen, onClose, onSubmit, initialData }: EventModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [fullDescription, setFullDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [location, setLocation] = useState("");
    const [maxParticipants, setMaxParticipants] = useState("");
    const [eventDate, setEventDate] = useState("");

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || "");
            setDescription(initialData.description || "");
            setFullDescription(initialData.full_description || "");
            setImageUrl(initialData.image_url || "");
            setLocation(initialData.location || "");
            setMaxParticipants(initialData.max_participants?.toString() || "");
            setEventDate(initialData.event_date ? new Date(initialData.event_date).toISOString().split('T')[0] : "");
        } else {
            setTitle("");
            setDescription("");
            setFullDescription("");
            setImageUrl("");
            setLocation("");
            setMaxParticipants("");
            setEventDate("");
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            title,
            description,
            full_description: fullDescription,
            image_url: imageUrl,
            location,
            max_participants: Number(maxParticipants),
            event_date: eventDate
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{initialData ? "Modifier l'événement" : "Nouvel Événement"}</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label>Titre :</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Lieu :</label>
                        <input value={location} onChange={e => setLocation(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>URL Image :</label>
                        <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Résumé :</label>
                        <input value={description} onChange={e => setDescription(e.target.value)} maxLength={100} />
                    </div>
                    <div className="form-group">
                        <label>Description complète :</label>
                        <textarea value={fullDescription} onChange={e => setFullDescription(e.target.value)} rows={4} />
                    </div>
                    <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Date :</label>
                            <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Participants max :</label>
                            <input type="number" value={maxParticipants} onChange={e => setMaxParticipants(e.target.value)} />
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>Annuler</button>
                        <button type="submit" className="confirm-btn">
                            {initialData ? "Enregistrer" : "Publier"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
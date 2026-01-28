const API_URL = "http://localhost:5143/api/events";

// Fonction utilitaire pour le token (interne au fichier)
const getAuthHeaders = () => {
    const rawToken = localStorage.getItem("token");
    const token = rawToken ? rawToken.trim().replace(/^"|"$/g, '') : null;
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

// On exporte une fonction par défaut qui contient tes méthodes
export default function eventSubscription() {
    return {
        register: async (eventId: number) => {
            const response = await fetch(`${API_URL}/${eventId}/register`, {
                method: "POST",
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error("Erreur lors de l'inscription");
            return await response.json();
        },

        unregister: async (eventId: number) => {
            const response = await fetch(`${API_URL}/${eventId}/unregister`, {
                method: "DELETE",
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error("Erreur lors de la désinscription");
            return await response.json();
        }
    };
}
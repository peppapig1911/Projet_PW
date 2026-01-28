
const getAuthHeaders = () => {
    const rawToken = localStorage.getItem("token");
    const token = rawToken ? rawToken.trim().replace(/^"|"$/g, '') : null;
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

export function eventsubActions() {
    return {
        register: async (eventId: number) => {
            const response = await fetch(`http://localhost:5143/api/events/${eventId}/register`, {
                method: "POST",
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error("Erreur lors de l'inscription");
            return await response.json();
        },

        unregister: async (eventId: number) => {
            const response = await fetch(`http://localhost:5143/api/events/${eventId}/unregister`, {
                method: "DELETE",
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error("Erreur lors de la désinscription");
            return await response.json();
        }
    };
}
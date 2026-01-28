const pool = require("../../db");

// Créer un événement

exports.createEvent = async (req, res) => {
    try {
        const { title, description, max_participants, event_date } = req.body;
        const owner_id = req.user.id;

        const query = `
            INSERT INTO event (title, description, owner_id, max_participants, event_date, nb_suscribers)
            VALUES ($1, $2, $3, $4, $5, 0) RETURNING *`;

        const result = await pool.query(query, [title, description, owner_id, max_participants, event_date]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Erreur SQL détaillée:", error);
        res.status(500).json({ error: "Erreur serveur lors de la création" });
    }
};



// Supprimer un événement

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Suppression de l'event si l'owner_id correspond à l'utilisateur
        const query = `DELETE FROM event WHERE event_id = $1 AND owner_id = $2 RETURNING *`;

        const result = await pool.query(query, [id, userId]);

        if (result.rowCount === 0) {
            return res.status(403).json({
                error: "Non autorisé ou événement inexistant."
            });
        }

        res.status(200).json({ message: "Événement supprimé", event: result.rows[0] });
    } catch (error) {
        console.error("Erreur SQL lors de la suppression:", error);
        res.status(500).json({ error: "Erreur serveur lors de la suppression" });
    }
};


exports.getAllEvents = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;

        const query = `
            SELECT e.*, 
            CASE WHEN es.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_registered
            FROM event e
            LEFT JOIN event_subscriptions es ON e.event_id = es.event_id AND es.user_id = $1
            ORDER BY e.event_id DESC
        `;

        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
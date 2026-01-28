const pool = require("../../db");


// S'inscrire à un événement

exports.register = async (req, res) => {
    try {
        const { id } = req.params; //event id
        const userId = req.user.id;

        await pool.query(
            "INSERT INTO event_subscriptions (user_id, event_id) VALUES ($1, $2)",
            [userId, id]
        );

        // On incrémente le compteur nb_suscribers de l'event
        const result = await pool.query(
            "UPDATE event SET nb_suscribers = nb_suscribers + 1 WHERE event_id = $1 RETURNING *",
            [id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') return res.status(400).json({ error: "Déjà inscrit" });
        res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
};

// Se désinscrire de l'événement

exports.unregister = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // On supprime le lien
        const deleteRes = await pool.query(
            "DELETE FROM event_subscriptions WHERE user_id = $1 AND event_id = $2",
            [userId, id]
        );

        if (deleteRes.rowCount === 0) return res.status(404).json({ error: "Inscription non trouvée" });

        // On décrémente le compteur
        const result = await pool.query(
            "UPDATE event SET nb_suscribers = nb_suscribers - 1 WHERE event_id = $1 RETURNING *",
            [id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la désinscription" });
    }
};
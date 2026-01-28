const pool = require("../db");

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


exports.getAllEvents = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM event ORDER BY event_id DESC");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération" });
    }
};
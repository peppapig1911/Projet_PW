const pool = require("../../db");

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
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la création" });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        await pool.query('DELETE FROM event_subscriptions WHERE event_id = $1', [id]);
        const query = `DELETE FROM event WHERE event_id = $1 AND owner_id = $2 RETURNING *`;
        const result = await pool.query(query, [id, userId]);
        if (result.rowCount === 0) {
            return res.status(403).json({ error: "Non autorisé ou événement inexistant." });
        }
        res.status(200).json({ message: "Événement supprimé", event: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la suppression" });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, max_participants, event_date } = req.body;
        const userId = req.user.id;
        const result = await pool.query(
            `UPDATE event
             SET title = $1, description = $2, max_participants = $3, event_date = $4
             WHERE event_id = $5 AND owner_id = $6
             RETURNING *`,
            [title, description, max_participants, event_date, id, userId]
        );
        if (result.rows.length === 0) {
            return res.status(403).json({ error: "Non autorisé ou événement inexistant" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const query = `
            SELECT e.*,
                   (SELECT COUNT(*) FROM event_subscriptions WHERE event_id = e.event_id) as nb_suscribers,
                   EXISTS(SELECT 1 FROM event_subscriptions WHERE event_id = e.event_id AND user_id = $1) AS is_registered
            FROM event e
            ORDER BY e.event_id DESC
        `;
        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user.id : null;

        const query = `
            SELECT
                e.*,
                (SELECT COUNT(*) FROM event_subscriptions WHERE event_id = e.event_id) as nb_suscribers,
                EXISTS(SELECT 1 FROM event_subscriptions WHERE event_id = e.event_id AND user_id = $2) as is_user_subscribed,
                (
                    SELECT COALESCE(json_agg(u.username), '[]'::json)
                    FROM event_subscriptions es
                             JOIN users u ON es.user_id = u.id
                    WHERE es.event_id = e.event_id
                ) as participants_list
            FROM event e
            WHERE e.event_id = $1
        `;

        const result = await pool.query(query, [id, userId]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Événement introuvable" });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.toggleSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const check = await pool.query(
            "SELECT * FROM event_subscriptions WHERE event_id = $1 AND user_id = $2",
            [id, userId]
        );

        if (check.rows.length > 0) {
            await pool.query("DELETE FROM event_subscriptions WHERE event_id = $1 AND user_id = $2", [id, userId]);
        } else {
            await pool.query("INSERT INTO event_subscriptions (event_id, user_id) VALUES ($1, $2)", [id, userId]);
        }

        const newList = await pool.query(`
            SELECT u.username FROM event_subscriptions es
                                       JOIN users u ON es.user_id = u.id
            WHERE es.event_id = $1`, [id]);

        res.status(200).json({
            subscribed: check.rows.length === 0,
            participants_list: newList.rows.map(r => r.username)
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
};
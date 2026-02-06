const pool = require("../../db");

exports.createEvent = async (req, res) => {
    console.log("--- DEBUG BACKEND ---");
    console.log("Body reçu :", req.body); // On vérifie si 'location' est là
    try {
        const { title, description, full_description, image_url, location, max_participants, event_date } = req.body;
        const owner_id = req.user.id;

        const query = `
            INSERT INTO event (
                title,
                description,
                full_description,
                image_url,
                location,
                owner_id,
                max_participants,
                event_date,
                nb_suscribers
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0)
            RETURNING *`;

        const values = [
            title,
            description,
            full_description || null,
            image_url || null,
            location || null,
            owner_id,
            max_participants,
            event_date
        ];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la création" });
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
    console.log("--- DEBUG BACKEND ---");
    console.log("Body reçu :", req.body); // On vérifie si 'location' est là
    try {
        const { id } = req.params;
        const { title, description, full_description, image_url, location, max_participants, event_date } = req.body;
        const userId = req.user.id;

        const result = await pool.query(
            `UPDATE event
             SET title = $1,
                 description = $2,
                 full_description = $3,
                 image_url = $4,
                 location = $5,
                 max_participants = $6,
                 event_date = $7
             WHERE event_id = $8 AND owner_id = $9
             RETURNING *`,
            [title, description, full_description, image_url, location, max_participants, event_date, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({ error: "Non autorisé ou événement inexistant" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la mise à jour" });
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

        const countRes = await pool.query("SELECT COUNT(*) FROM event_subscriptions WHERE event_id = $1", [id]);
        const listRes = await pool.query(`
            SELECT u.username
            FROM event_subscriptions es
                     JOIN users u ON es.user_id = u.id
            WHERE es.event_id = $1`, [id]);

        res.status(200).json({
            subscribed: check.rows.length === 0,
            nb_suscribers: parseInt(countRes.rows[0].count),
            participants_list: listRes.rows.map(r => r.username)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
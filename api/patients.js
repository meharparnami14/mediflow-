const db = require("./db");

module.exports = async (req, res) => {

    try {

        // VIEW ALL PATIENTS
        if (req.method === "GET" && !req.query.search && !req.query.id) {

            const [rows] =
                await db.query("SELECT * FROM patients");

            return res.status(200).json(rows);
        }

        // SEARCH PATIENT
        if (req.method === "GET" && req.query.search) {

            const search =
                `%${req.query.search}%`;

            const [rows] =
                await db.query(
                    "SELECT * FROM patients WHERE name LIKE ?",
                    [search]
                );

            return res.status(200).json(rows);
        }

        // GET SINGLE PATIENT
        if (req.method === "GET" && req.query.id) {

            const [rows] =
                await db.query(
                    "SELECT * FROM patients WHERE id=?",
                    [req.query.id]
                );

            return res.status(200).json(rows[0]);
        }

        // ADD PATIENT
        if (req.method === "POST") {

            const {
                name,
                age,
                gender,
                phone
            } = req.body;

            await db.query(
                `INSERT INTO patients
                (name, age, gender, phone)
                VALUES (?, ?, ?, ?)`,
                [name, age, gender, phone]
            );

            return res.status(201).json({
                message: "Patient Added"
            });
        }

        // UPDATE PATIENT
        if (req.method === "PUT") {

            const {
                id,
                name,
                age,
                gender,
                phone
            } = req.body;

            await db.query(
                `UPDATE patients
                 SET name=?,
                     age=?,
                     gender=?,
                     phone=?
                 WHERE id=?`,
                [
                    name,
                    age,
                    gender,
                    phone,
                    id
                ]
            );

            return res.status(200).json({
                message: "Patient Updated"
            });
        }

        // DELETE PATIENT
        if (req.method === "DELETE") {

            await db.query(
                "DELETE FROM patients WHERE id=?",
                [req.query.id]
            );

            return res.status(200).json({
                message: "Patient Deleted"
            });
        }

        return res.status(405).json({
            error: "Method Not Allowed"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: error.message
        });
    }
};

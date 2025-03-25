import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello World! Im in tables.js");
});

router.get("/create-table", (req, res) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL
        )
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al crear la tabla:", err);
            res.status(500).send("Error al crear la tabla");
            return;
        }
        console.log("Tabla creada con éxito");
        res.send("Tabla creada con éxito");
    });
});

export default router;
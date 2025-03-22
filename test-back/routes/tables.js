import express from "express";
import * as plopModule from "plop"; // Importa el módulo completo
import { db } from "../index.js"; // Importa la conexión a la base de datos

const router = express.Router();

router.post("/create-table-plop", async (req, res) => {
    const { tableName, columns } = req.body;

    // Ejecuta Plop.js programáticamente
    const plop = plopModule.default; // Accede al default export
    const plopInstance = plop(process.cwd() + "/plopfile.js");

    plopInstance.runGenerator("create-mysql-table", {
        tableName: tableName,
        columns: columns,
    }, async (err, results) => {
        if (err) {
            console.error("Error al ejecutar Plop:", err);
            return res.status(500).json({ error: "Error al generar el archivo SQL" });
        }

        // Lee el archivo SQL generado
        const fs = require("fs").promises;
        const sqlFilePath = `database/migrations/${tableName}.sql`;

        try {
            const sql = await fs.readFile(sqlFilePath, "utf8");

            // Ejecuta el SQL en MySQL
            db.query(sql, (err, results) => {
                if (err) {
                    console.error("Error al ejecutar el SQL:", err);
                    return res.status(500).json({ error: err.message });
                }

                res.json({ message: "Tabla creada exitosamente" });
            });
        } catch (error) {
            console.error("Error al leer el archivo SQL:", error);
            return res.status(500).json({ error: "Error al leer el archivo SQL" });
        }
    });
});

export default router;
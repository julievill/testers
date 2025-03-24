import { db } from "../index.js";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = express.Router();

router.post("/create-table-plop", async (req, res) => {
    const { tableName, columns } = req.body;

    try {
        // Run Plop.js via CLI (more reliable than programmatic API)
        const plopProcess = exec(
            `npx plop sql-migration --tableName="${tableName}" --columns="${columns}"`,
            { cwd: __dirname },
            (error, stdout, stderr) => {
                if (error) {
                    console.error("Plop error:", stderr);
                    return res.status(500).json({ error: "Plop failed" });
                }

                // Read the generated SQL file
                const sqlFilePath = path.join(__dirname, "database/migrations", `${tableName}.sql`);
                const sql = fs.readFileSync(sqlFilePath, "utf8");

                // Execute SQL
                db.query(sql, (err, result) => {
                    if (err) {
                        console.error("MySQL error:", err);
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ message: "Table created!" });
                });
            }
        );
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
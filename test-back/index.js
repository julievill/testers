import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mysql from "mysql2";
import fs from "fs";
import path from "path";
import { Plop, run } from "plop";
import { dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.NODE_PORT || 3000;

app.use(cors());
app.use(express.json());

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configura la conexión a MySQL
const db = mysql.createConnection({
    host: process.env.NODE_DB_HOST,
    user: process.env.NODE_DB_USER,
    password: process.env.NODE_DB_PASSWORD,
    database: process.env.NODE_DB_NAME,
});

// Conecta a la base de datos
db.connect((err) => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err);
        return;
    }
    console.log("Conexión a la base de datos MySQL establecida");
});

// Función para ejecutar un archivo SQL
const executeSQLFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, sql) => {
            if (err) return reject(err);

            db.query(sql, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    });
};

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/check-db-connection", (req, res) => {
    db.ping((err) => {
        if (err) {
            console.error("Error al comprobar la conexión con la base de datos:", err);
            return res.status(500).json({ success: false, message: "Error al conectar con la base de datos" });
        }
        res.json({ success: true, message: "Conexión con la base de datos exitosa" });
    });
});

app.get('/create-table', async (req, res) => {
    console.log("Creating table...");
    const name = "users";
    const columns = "name VARCHAR(255), email VARCHAR(255)";

    console.log("name:", name);
    console.log("columns:", columns);

    if (!name || !columns) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        console.log("Preparing Plop...");

        // Usamos Plop.prepare correctamente
        await new Promise((resolve, reject) => {
            Plop.prepare({
                cwd: __dirname,
                configPath: path.join(__dirname, "plopfile.js"),
                preload: [],
                completion: false,
            }, async (env) => {
                try {
                    console.log("Running Plop...");
                    console.log("Datos enviados a Plop:", { tableName: name, columns: columns });
                    await Plop.execute(env, run, {
                        generator: "sql-migration",
                        data: { tableName: name, columns: columns },
                    });
                    resolve();
                } catch (err) {
                    console.error("Error al ejecutar Plop:", err);
                    reject(err);
                }
            });
        });

        // Ajustar la ruta dentro del contenedor
        const filePath = path.join(__dirname, "database/migrations", `${name}.sql`);

        if (!fs.existsSync(filePath)) {
            console.error("Archivo no encontrado:", filePath);
            return res.status(500).json({ success: false, message: "Error al generar la migración" });
        }

        console.log("Ejecutando SQL desde:", filePath);
        await executeSQLFile(filePath);

        return res.json({ success: true, message: "Tabla creada correctamente" });
    } catch (error) {
        console.error("Error al crear la tabla:", error);
        return res.status(500).json({ success: false, message: "Error al crear la tabla" });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
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
var insertedId;

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

app.get("/last-inserted-id", (req, res) => {
    const query = `SELECT name, columns FROM newTables WHERE id = ?`;

    db.query(query, [insertedId], (err, results) => {
        if (err) {
            console.error("Error al obtener los datos de la tabla newTables:", err);
            return res.status(500).json({ success: false, message: "Error al obtener los datos de la tabla" });
        }

        if (results.length > 0) {
            const { name, columns } = results[0];
            res.json({ success: true, message: "Datos obtenidos correctamente", data: { name, columns } });
        } else {
            res.status(404).json({ success: false, message: "No se encontraron datos para el ID proporcionado" });
        }
    });
});

app.get('/create-table', async (req, res) => {
    console.log("Creating table...");
    const name = "users";
    const columns = "name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP";
    console.log("name:", name);
    console.log("columns:", columns);

    if (!name || !columns) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        console.log("Creating table in database...");
        const query = `INSERT INTO newTables (name, columns) VALUES (?, ?)`;

        const results = await new Promise((resolve, reject) => {
            db.query(query, [name, columns], (err, results) => {
                if (err) {
                    console.error("Error al insertar datos en la tabla newTables:", err);
                    return reject(err);
                }
                resolve(results);
            });
        });

        const insertedId = results.insertId; // Obtener el ID del registro insertado

        console.log("Preparing Plop...");
        await new Promise((resolve, reject) => {
            Plop.prepare(
                {
                    cwd: __dirname,
                    configPath: path.join(__dirname, "plopfile.js"),
                    preload: [],
                    completion: false,
                },
                async (env) => {
                    try {
                        await Plop.execute(env, run, {
                            generator: "sql-migration",
                        });
                        resolve();
                    } catch (err) {
                        console.error("Error al ejecutar Plop:", err);
                        reject(err);
                    }
                }
            );
        });

        const filePath = path.join(__dirname, "database/migrations", `${name}.sql`);

        if (!fs.existsSync(filePath)) {
            console.error("Archivo no encontrado:", filePath);
            return res.status(500).json({ success: false, message: "Error al generar la migración" });
        }

        console.log("Ejecutando SQL desde:", filePath);
        await executeSQLFile(filePath);

        return res.json({ success: true, message: "Tabla creada correctamente", data: { id: insertedId } });
    } catch (error) {
        console.error("Error al crear la tabla:", error);
        return res.status(500).json({ success: false, message: "Error al crear la tabla" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
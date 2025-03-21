import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mysql from "mysql2"; // Importa mysql2

dotenv.config();

const app = express();
const port = process.env.NODE_PORT || 3000;

app.use(cors());
app.use(express.json());

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

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Ejemplo de una ruta que usa la base de datos
app.get("/usuarios", (req, res) => {
    db.query("SELECT * FROM usuarios", (err, results) => {
        if (err) {
            console.error("Error al ejecutar la consulta:", err);
            res.status(500).json({ error: "Error al obtener usuarios" });
            return;
        }
        res.json(results);
    });
});

app.post("/execute-sql", (req, res) => {
    const { sql } = req.body;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al ejecutar SQL:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export { db }; 
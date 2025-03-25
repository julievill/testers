import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mysql from "mysql2";

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

app.get("/check-db-connection", (req, res) => {
    db.ping((err) => {
        if (err) {
            console.error("Error al comprobar la conexión con la base de datos:", err);
            return res.status(500).json({ success: false, message: "Error al conectar con la base de datos" });
        }
        res.json({ success: true, message: "Conexión con la base de datos exitosa" });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export { db }; // Exporta la conexión para usarla en otros archivos (si es necesario)
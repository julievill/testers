import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mysql from "mysql2";
import tablesRoutes from "./routes/tables.js";

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

// Usa las rutas para la creación de tablas
app.use("/plop", tablesRoutes); // Usa las rutas definidas en tables.js

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export { db }; // Exporta la conexión para usarla en otros archivos (si es necesario)
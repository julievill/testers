export default function (plop) {
    plop.setGenerator("create-mysql-table", {
        description: "Genera código SQL para crear una tabla MySQL",
        prompts: [
            {
                type: "input",
                name: "tableName",
                message: "Nombre de la tabla:",
            },
            {
                type: "input",
                name: "columns",
                message:
                    "Columnas (nombre tipo, separados por coma. Ej: id INT AUTO_INCREMENT PRIMARY KEY, nombre VARCHAR(255))",
            },
        ],
        actions: [
            {
                type: "add",
                path: "database/migrations/{{tableName}}.sql",
                templateFile: "plop-templates/create-table.sql.hbs",
            },
        ],
    });
};
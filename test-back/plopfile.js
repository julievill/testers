import Handlebars from "handlebars";

export default function (plop) {
    // Registrar el helper "split"
    Handlebars.registerHelper("split", function (input, delimiter) {
        return input.split(delimiter).join(", ");
    });

    plop.setGenerator("sql-migration", {
        description: "Genera un archivo SQL para crear una tabla",
        prompts: [],
        actions: (data) => {
            console.log("Datos recibidos en el generador:", data);
        
            const { tableName, columns } = data;
        
            if (!tableName || !columns) {
                console.error("Faltan datos requeridos: tableName o columns");
                throw new Error("Faltan datos requeridos para el generador");
            }
        
            return [
                {
                    type: "add",
                    templateFile: "plop-templates/create-table.sql.hbs",
                    path: "database/migrations/{{tableName}}.sql",
                    data: {
                        tableName,
                        columns,
                    },
                },
            ];
        },
    });
}
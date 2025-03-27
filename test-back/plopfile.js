import Handlebars from "handlebars";
import fetch from "node-fetch";

async function fetchTableData() {
    console.log("Obteniendo datos de la APIssssss...");
    try {
        console.log("Obteniendo datos de la API dentro del try...");
        const response = await fetch("http://localhost:3000/last-inserted-id");
        console.log("Obteniendo datos de la API dentro del try... RESPONSE", response);
        return response.json();
    } catch (error) {
        console.error("Error al obtener datos de la API:", error);
        return { name: "fallback_table", columns: "name VARCHAR(100)" };
    }
}

export default function (plop) {
    // Registrar el helper "split"
    Handlebars.registerHelper("split", function (input, delimiter) {
        return input.split(delimiter).join(", ");
    });

    plop.setGenerator("sql-migration", {
        description: "Genera un archivo SQL para crear una tabla",
        prompts: [],
        actions: async () => {
            console.log("Obteniendo datos del último ID insertado...");
            const { name, columns } = await fetchTableData();

            console.log("Datos obtenidos:", { name, columns });

            return [
                {
                    type: "add",
                    templateFile: "plop-templates/create-table.sql.hbs",
                    path: `database/migrations/${name}.sql`,
                    data: {
                        tableName: name,
                        columns,
                    },
                },
            ];
        },
    });
}
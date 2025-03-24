// plopfile.js
export default function (plop) {
    plop.setGenerator("sql-migration", {
        description: "Generate SQL migration file",
        prompts: [
            {
                type: "input",
                name: "tableName",
                message: "Table name:",
            },
            {
                type: "input",
                name: "columns",
                message: "Columns (format: 'name:type,name2:type2'):",
            },
        ],
        actions: [
            {
                type: "add",
                path: "database/migrations/{{tableName}}.sql",
                templateFile: "templates/table.sql.hbs",
            },
        ],
    });
}
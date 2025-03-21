module.exports = function (plop) {
    plop.setGenerator("create-vue-crud-page", {
        description: "Genera una página CRUD en Vue.js para una tabla específica",
        prompts: [
            {
                type: "input",
                name: "tableName",
                message: "Nombre de la tabla:",
            },
        ],
        actions: [
            {
                type: "add",
                path: "src/components/{{tableName}}Crud.vue",
                templateFile: "plop-templates/vue-crud-page.vue.hbs",
            },
        ],
    });
};
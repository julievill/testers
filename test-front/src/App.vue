<template>
  <div>
    <h1>Crear Tabla</h1>
    <input v-model="tableName" placeholder="Nombre de la tabla" />
    <textarea v-model="columns" placeholder="Columnas (ej: id INT AUTO_INCREMENT PRIMARY KEY, nombre VARCHAR(255))"></textarea>
    <button @click="createTable">Crear Tabla</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableName: "",
      columns: "",
    };
  },
  methods: {
    async createTable() {
      try {
        const response = await fetch("http://localhost:3000/tables/create-table-plop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tableName: this.tableName, columns: this.columns }),
        });
        if (response.ok) {
          alert("Tabla creada exitosamente");
        } else {
          alert("Error al crear la tabla");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
  },
};
</script>
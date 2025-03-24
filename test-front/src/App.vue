<template>
  <div class="table-creator">
    <h1>Crear Tabla en MySQL</h1>
    <div class="form-group">
      <label for="tableName">Nombre de la tabla:</label>
      <input 
        id="tableName" 
        v-model="tableName" 
        placeholder="Ej: usuarios" 
        class="form-input"
      />
    </div>
    
    <div class="form-group">
      <label>Columnas:</label>
      <div v-for="(column, index) in columns" :key="index" class="column-row">
        <input
          v-model="column.name"
          placeholder="Nombre de columna"
          class="form-input"
        />
        <select v-model="column.type" class="form-select">
          <option value="VARCHAR(255)">Texto (VARCHAR)</option>
          <option value="INT">Número (INT)</option>
          <option value="DATE">Fecha (DATE)</option>
          <option value="BOOLEAN">Booleano (BOOLEAN)</option>
        </select>
        <button @click="removeColumn(index)" class="remove-btn">×</button>
      </div>
      <button @click="addColumn" class="add-btn">+ Añadir Columna</button>
    </div>

    <button @click="createTable" class="submit-btn">Crear Tabla</button>
    
    <div v-if="message" class="message" :class="{ error: isError }">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableName: "",
      columns: [
        { name: "id", type: "INT AUTO_INCREMENT PRIMARY KEY" }
      ],
      message: "",
      isError: false
    };
  },
  methods: {
    addColumn() {
      this.columns.push({ name: "", type: "VARCHAR(255)" });
    },
    removeColumn(index) {
      if (this.columns.length > 1) {
        this.columns.splice(index, 1);
      }
    },
    async createTable() {
      if (!this.tableName) {
        this.showMessage("Debes ingresar un nombre para la tabla", true);
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/tables/create-table-plop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tableName: this.tableName,
            columns: this.columns.filter(col => col.name)
          }),
        });

        const result = await response.json();
        
        if (response.ok) {
          this.showMessage(`Tabla ${this.tableName} creada exitosamente!`);
          this.resetForm();
        } else {
          this.showMessage(result.error || "Error al crear la tabla", true);
        }
      } catch (error) {
        this.showMessage("Error de conexión con el servidor", true);
        console.error("Error:", error);
      }
    },
    showMessage(text, isError = false) {
      this.message = text;
      this.isError = isError;
      setTimeout(() => this.message = "", 3000);
    },
    resetForm() {
      this.tableName = "";
      this.columns = [{ name: "id", type: "INT AUTO_INCREMENT PRIMARY KEY" }];
    }
  }
};
</script>

<style scoped>
.table-creator {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  background: #f9f9f9;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-input, .form-select {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.column-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.column-row .form-input {
  flex: 2;
}

.column-row .form-select {
  flex: 1;
}

.remove-btn {
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 30px;
}

.add-btn {
  background: #4285f4;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
}

.submit-btn {
  background: #34a853;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  margin-top: 1rem;
}

.message {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
}

.message:not(.error) {
  background: #d4edda;
  color: #155724;
}

.error {
  background: #f8d7da;
  color: #721c24;
}
</style>
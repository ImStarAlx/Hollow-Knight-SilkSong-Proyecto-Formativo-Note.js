const mysql = require('mysql2');

const conexion = mysql.createConnection({
    // Render y otros servicios inyectan estos valores automáticamente
    host: process.env.DB_HOST || "localhost", 
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "registro_usuarios",
    port: process.env.DB_PORT || 3306
});

// conectar
conexion.connect((err) => {
    if (err) {
        console.error("Error conectando a la base de datos:", err.message);
        return;
    }
    console.log("Conectado exitosamente a la base de datos");
});

module.exports = conexion;

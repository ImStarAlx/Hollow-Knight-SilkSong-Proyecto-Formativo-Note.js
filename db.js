const mysql = require('mysql2');

// Configuración optimizada para Aiven y Render
const conexion = mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Proceso de conexión
conexion.connect((err) => {
    if (err) {
        console.error("Error conectando a la base de datos de Aiven:", err.message);
        return;
    }
    console.log("¡Conexión exitosa a la base de datos en la nube!");
});

module.exports = conexion;

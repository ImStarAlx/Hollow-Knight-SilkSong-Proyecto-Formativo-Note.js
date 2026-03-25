const express = require("express");
const bodyParser = require("body-parser");
const conexion = require("./db"); 
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// RUTA DE INICIO (El nuevo HTML con fondo amarillo y Hornet)
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// RUTA DE REGISTRO (Tu formulario actual)
app.get("/registro", (req, res) => {
    res.sendFile(__dirname + "/public/registro.html");
});

app.post("/guardar", (req, res) => {
    const { nombre, correo, plataforma, novedades } = req.body;
    const quiereNovedades = novedades === '1' ? 1 : 0;

    if (!nombre || !correo || !plataforma) {
        return res.send("<h2>Error: Todos los campos son obligatorios</h2> <a href='/registro'>volver</a>");
    }

    const sql = "INSERT INTO pre_registro_game (nombre, correo, plataforma, recibir_novedades) VALUES (?, ?, ?, ?)";
    
    conexion.query(sql, [nombre, correo, plataforma, quiereNovedades], (err) => {
        if (err) {
            console.error(err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.send("<h2>Este correo ya está registrado</h2> <a href='/registro'>volver</a>");
            }
            return res.send("Error al guardar en la base de datos");
        }
        res.redirect("/listar");
    });
});

app.get("/listar", (req, res) => {
    conexion.query("SELECT * FROM pre_registro_game", (err, filas) => {
        if (err) {
            console.error(err);
            return res.send("Error al obtener los datos");
        }

        let tabla = `
        <style>
            @import url('https://fonts.googleapis.com');
            
            body {
                background: radial-gradient(circle, #2c0a0a 0%, #0a0a0a 100%);
                color: #e0d8d0;
                font-family: 'Quicksand', sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 50px;
                min-height: 100vh;
                margin: 0;
                overflow: hidden;
            }

            h1 {
                font-family: 'Cinzel', serif;
                color: #ff4d4d;
                text-transform: uppercase;
                letter-spacing: 4px;
                text-shadow: 0 0 15px rgba(255, 77, 77, 0.5);
                z-index: 10;
            }

            table {
                width: 90%;
                max-width: 1000px;
                border-collapse: collapse;
                background-color: rgba(15, 10, 10, 0.95);
                border: 2px solid #a62a2a;
                box-shadow: 0 0 30px rgba(0,0,0,0.9);
                z-index: 10;
            }

            th { background-color: #4a0d0d; color: #ff4d4d; padding: 15px; border-bottom: 2px solid #a62a2a; font-family: 'Cinzel'; text-transform: uppercase; }
            td { padding: 12px; border: 1px solid #331111; text-align: center; color: #d1c4b2; }

            .btn-volver {
                margin-top: 30px;
                color: #ff4d4d;
                text-decoration: none;
                font-family: 'Cinzel', serif;
                border: 1px solid #a62a2a;
                padding: 10px 20px;
                z-index: 10;
                transition: 0.3s;
                text-transform: uppercase;
            }

            .btn-volver:hover {
                background: #ff4d4d;
                color: #000;
                box-shadow: 0 0 15px #ff4d4d;
            }

            .fuego { position: fixed; bottom: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
            .fuego span {
                position: absolute; bottom: -50px; background: rgba(255, 77, 77, 0.6);
                box-shadow: 0 0 10px #ff4d4d, 0 0 20px #ffae00; border-radius: 50%;
                animation: subir 5s infinite linear; opacity: 0;
            }
            @keyframes subir {
                0% { transform: translateY(0) scale(1); opacity: 0; }
                20% { opacity: 0.7; }
                100% { transform: translateY(-110vh) scale(0.3); opacity: 0; }
            }
        </style>

        <div class="fuego">
            <span style="left:5%; width:10px; height:10px; animation-delay:0s"></span>
            <span style="left:25%; width:15px; height:15px; animation-delay:2s"></span>
            <span style="left:45%; width:8px; height:8px; animation-delay:1s"></span>
            <span style="left:65%; width:12px; height:12px; animation-delay:3s"></span>
            <span style="left:85%; width:9px; height:9px; animation-delay:0.5s"></span>
        </div>

        <h1>Telalejana te necesita...</h1>
        <table>
            <thead>
                <tr><th>ID</th><th>Alias</th><th>Correo</th><th>Plataforma</th><th>Novedades</th><th>Fecha</th></tr>
            </thead>
            <tbody>`;

        filas.forEach(f => {
            const recibeNoticias = f.recibir_novedades ? "✅" : "❌";
            tabla += `
            <tr>
                <td>${f.id}</td>
                <td><strong style="color:#ff4d4d">${f.nombre}</strong></td>
                <td>${f.correo}</td>
                <td>${f.plataforma}</td>
                <td>${recibeNoticias}</td>
                <td>${new Date(f.fecha_registro).toLocaleString()}</td>
            </tr>`;
        });

        tabla += `</tbody></table><a href='/' class='btn-volver'>Volver al Nido</a>`;
        res.send(tabla);
    });
});

app.listen(PORT, () => console.log(`Servidor de Beta corriendo en: http://localhost:${PORT}`));

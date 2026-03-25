const mysql= require('mysql2')

const conexion= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"registro_usuarios"
});
//conectar
conexion.connect((err)=>{
    if(err) throw err;
    console.log("conectado a la base de datos MySql");
});

//exportar modulo
module.exports= conexion;
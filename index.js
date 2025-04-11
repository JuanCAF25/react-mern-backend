const express = require('express')
const { dbConnection } = require('./db/config')
const cors = require('cors')
require('dotenv').config()

//Crear el servido de express
const app = express()


//Directorio publico
app.use(express.static('public'))

//Base de datos
dbConnection()

//Cors
app.use(cors())

//Lectura y parseo del body
app.use(express.json())

//Rutas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))

//escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
})
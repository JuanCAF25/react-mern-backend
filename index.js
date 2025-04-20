const path = require('path')

const express = require('express')
require('dotenv').config()
const cors = require('cors')
const { dbConnection } = require('./db/config')

const port = process.env.PORT




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

app.use('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname,'public/index.html'))
})

//escuchar peticiones
app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
})
const { response } = require('express')
const { validationResult } = require('express-validator')
const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {
    const saltRounds = 10
    const { name, email, password } = req.body

    try {
        let usuario = await Usuario.findOne({ email })

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario ya existente'
            })
        }

        usuario = new Usuario(req.body)

        //Ecnriptar contraseña
        const salt = bcrypt.genSaltSync(saltRounds)
        const hash = bcrypt.hashSync(password, salt)
        usuario.password = hash

        await usuario.save()

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name)

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token 
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: '500 Contactar asistente'
        })
    }

}

const loginUsuario = async (req, res = response) => {
    const { email, password } = req.body

    try {
        const usuario = await Usuario.findOne({ email })

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales no validas'
            })
        }

        //confirmar passwords
        const validPassword = bcrypt.compareSync(password, usuario.password)

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password no valida'
            })
        }

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name)

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        throw new Error("error");
        res.status(500).json({
            ok: false,
            msg: '500 Contactar asistente'
        })
    }
}

const revalidarToken = async (req, res = response) => {
    const {uid, name} = req

    //generar un nuevo JWT y retornarlo en esta petición

    const token = await generarJWT(uid, name)

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}
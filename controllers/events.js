const { response } = require('express')
const Evento = require('../models/Evento')


const getEventos = async (req, res = response) => {

    const eventos = await Evento.find()
        .populate('user', "name")

    res.status(201).json({
        ok: true,
        eventos
    })
}

const crearEvento = async (req, res = response) => {
    const evento = new Evento(req.body)

    try {
        evento.user = req.uid
        const eventoGuardado = await evento.save()

        res.json({
            ok: true,
            evento: eventoGuardado
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Contacte a soporte"
        })
    }
}

const actualizarEvento = async(req, res = response) => {
    const eventoId = req.params.id
    const uid = req.uid

    try {

        const evento = await Evento.findById(eventoId)

        if (!evento){
            return res.status(404).json({
                ok: false,
                msg: "No existe envento con ese ID"
            })
        }

        if (evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: "No tiene permiso de editar el evento"
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true})

        res.json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "contacte a soporte"
        })
    }
}

const borrarEvento = async(req, res = response) => {
    const eventoId = req.params.id
    const uid = req.uid


    try {
        const evento = await Evento.findById(eventoId)

        if (!evento){
            return res.status(404).json({
                ok: false,
                msg: "No existe envento con ese ID"
            })
        }

        if (evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: "No tiene permiso de eliminar el evento"
            })
        }

        await Evento.findByIdAndDelete(eventoId)

        res.json({
            ok: true,
            msg: "evento eliminado"
        })

        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "contacte a soporte"
        })
    }
}

module.exports = {
    actualizarEvento,
    borrarEvento,
    crearEvento,
    getEventos,
}
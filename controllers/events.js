const {response} = require('express')
const Evento = require('../models/Events')

const getEventos = async (req, res = response) => {

    const eventos = await Evento.find()
                              .populate('user', 'name')

    res.json({
        ok: true,
        eventos
    })
}
const crearEvento = async (req, res) => {

    const evento = new Evento(req.body);

    try {

        evento.user = req.uid
        
        const savedEvent = await evento.save();

        res.json({
            ok:true,
            evento: savedEvent 
        })


    } catch (error) {
        console.log(error)
    }
}
const actualizarEvento = async (req, res) => {
    
    const eventoId = req.params.id
    const uid = req.uid


    try {

        const evento = await Evento.findById(eventoId)
        if (!evento) {
           return res.status(404).json({
                ok: false,
                msg: 'No existe un evento con ese id'
            })
        }

        if (evento.user !== uid) {
           return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true})

        return res.json({
            ok: true,
            evento: eventoActualizado
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}
const eliminarEvento = async (req, res) => {
    
    const eventoId = req.params.id
    const uid = req.uid

    try {

        const evento = await Evento.findById(eventoId)
        if (!evento) {
           return res.status(404).json({
                ok: false,
                msg: 'No existe un evento con ese id'
            })
        }

        if (evento.user !== uid) {
           return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

       await Evento.findByIdAndDelete(eventoId)

        return res.json({
            ok: true
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
    
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}
/*
    Rutas de Eventos /Events
    host + /api/events
*/

const { Router } = require("express")
const { getEventos, crearEvento, actualizarEvento, borrarEvento } = require("../controllers/events")
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");

const router = Router()

//todas tiene que pasar por la validacion del JWT
router.use(validarJWT)

//obtener eventos
router.get('/', getEventos)

//Crear evento
router.post(
    '/',
    [
        check('title', 'Titulo requerido').not().isEmpty(),
        check('start', 'Fecha de inicio obligatoria').custom(isDate),
        check('end', 'Fecha de fin obligatoria').custom(isDate),
        validarCampos
    ],
    crearEvento
)

//Actualizar evento
router.put('/:id', actualizarEvento)

//Borrar evento
router.delete('/:id', borrarEvento)

module.exports = router
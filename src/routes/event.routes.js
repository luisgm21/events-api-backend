const express = require('express')
const router = express.Router()
const Evento = require('../models/event')

router.get('/', (req, res, next) => {
  Evento.find()
    .then(eventos => {
      res.json(eventos)
    })
    .catch(err => next(err))
})

router.get('/:id', (req, res, next) => {
  const { id } = req.params
  Evento.findById(id)
    .then((evento) => {
      if (evento) {
        return res.json(evento)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => {
      next(err)
    })
})
router.post('/', (req, res) => {
  const { title, description, place, important } = req.body
  const evento =
  new Evento(
    {
      title,
      description,
      date: new Date(),
      place,
      important
    })
  evento.save().then(savedEvent => {
    res.json({ mensaje: savedEvent })
  })
})

router.put('/:id', (req, res, next) => {
  const { id } = req.params
  const { title, description, place, important } = req.body
  const newEvent = {
    title,
    description,
    date: new Date(),
    place,
    important
  }

  Evento.findByIdAndUpdate(id, newEvent)
    .then(
      result => {
        res.json(result).end()
      }
    )
    .catch(err => next(err))

  // await Eventos.findByIdAndUpdate(id, newEvent)
  // res.json({ mensaje: 'Tarea actualizada', title, description })
})

router.delete('/:id', (req, res, next) => {
  const { id } = req.params
  Evento.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

module.exports = router

const express = require('express')
const router = express.Router()
let Eventos = require('../sample')

router.get('/', (req, res) => {
  res.json(Eventos)
})

router.post('/', (req, res) => {
  const { title, description } = req.body
  if (title && description) {
    console.log()
    if (String(title).length === 0 || String(description).length === 0) {
      res.status(400).end()
    }
    const ids = Eventos.map(event => Number(event.id))
    const max = Math.max(...ids)
    const newEvent = {
      id: max + 1,
      title,
      description
    }
    Eventos = [...Eventos, newEvent]
    res.json(newEvent).status(201).end()
  } else {
    res.status(400).end()
  }
})

router.get('/:id', (req, res) => {
  const { id } = req.params
  const event = Eventos.find(event => event.id === id)

  if (event) {
    res.json(event).status(200).end()
  } else {
    console.error('Error: id erronea o no existe')
    res.json('El evento que esta buscando no existe').end()
  }
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  Eventos = Eventos.filter(event => event.id !== id)
  res.status(204).end()
})

module.exports = router

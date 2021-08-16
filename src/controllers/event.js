const express = require('express')
const router = express.Router()
const Evento = require('../models/event')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res, next) => {
  try {
    const eventos = await Evento.find({}).populate('user', {
      username: 1,
      name: 1
    })
    res.json(eventos)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const evento = Evento.findById(id)
    if (evento) {
      return res.json(evento)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})
router.post('/', async (req, res, next) => {
  try {
    const {
      title,
      description,
      place,
      important
    } = req.body

    const authorization = req.get('authorization')

    let token = null

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      token = authorization.substring(7)
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    console.log()
    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const userOwnerEvent = await User.findById(decodedToken.id)

    const evento =
  new Evento(
    {
      title,
      description,
      date: new Date(),
      place,
      important,
      user: userOwnerEvent._id
    })

    const newEvento = await evento.save()

    userOwnerEvent.eventos = userOwnerEvent.eventos.concat(newEvento._id)
    console.log(userOwnerEvent)
    await userOwnerEvent.save()

    res.status(201).json(newEvento)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, description, place, important, user } = req.body
    const newEvent = {
      title,
      description,
      date: new Date(),
      place,
      important,
      user
    }
    const evento = await Evento.findByIdAndUpdate(id, newEvent, { new: true })
    res.json(evento).end()
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    await Evento.findByIdAndDelete(id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router

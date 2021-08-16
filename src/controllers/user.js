const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.get('/', async (req, res, next) => {
  const users = await User.find({}).populate('eventos', {
    title: 1,
    description: 1,
    date: 1,
    place: 1,
    important: 1
  })
  res.json(users)
})

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).populate('eventos', {
      title: 1,
      description: 1,
      date: 1,
      place: 1,
      important: 1
    })
    if (user) {
      return res.json(user)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res) => {
  const { body } = req
  const { username, name, password, eventos = [] } = body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const newUser = new User({
    username,
    name,
    passwordHash,
    eventos
  })
  await newUser.save()
  res.status(201).json(newUser)
})

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { username, name } = req.body
    const newUser = {
      username,
      name
    }
    const user = await User.findByIdAndUpdate(id, newUser, { new: true })
    res.json(user).end()
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    await User.findByIdAndDelete(id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router

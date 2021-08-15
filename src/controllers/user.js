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
    const { username, name, passwordHash, eventos } = req.body
    const newUser = {
      username,
      name,
      passwordHash,
      eventos
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

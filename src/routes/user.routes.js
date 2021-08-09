const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.get('/', (req, res, next) => {
  User.find()
    .then(usuarios => {
      res.json(usuarios)
    })
    .catch(err => next(err))
})

router.post('/', async (req, res) => {
  const { body } = req
  const { username, name, password } = body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const newUser = new User({
    username,
    name,
    passwordHash
  })
  await newUser.save()
  res.json(newUser)
})

module.exports = router

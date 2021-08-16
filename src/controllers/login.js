const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)
  if (!(user && passwordCorrect)) {
    res.status(401).json('error: invalid user or password')
  }

  const userforToken = {
    name: user.name,
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userforToken, process.env.SECRET, {
    expiresIn: 60 * 5
  })

  res.send({
    name: user.name,
    username: user.username,
    token
  })
})

module.exports = router

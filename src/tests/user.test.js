const { server } = require('../index')
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { api, getUsers } = require('./helpers')
describe('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pass', 10)
    const user = new User({ username: 'luisroot', name: 'LuisTester', passwordHash, events: [] })

    await user.save()
  })
  test('works as expected creating a fresh username', async () => {
    const userAtStart = await getUsers()

    const newUser = {
      username: 'luisdev',
      name: 'Luis',
      password: 'tw1tch',
      eventos: []
    }

    await api
      .post('/api/user')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await getUsers()

    expect(userAtEnd).toHaveLength(userAtStart.length + 1)

    const usernames = userAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const userAtStart = await getUsers()
    const newUser = {
      username: 'luisroot',
      name: 'LuisPedro',
      password: 'midutest'

    }

    const res = await api
      .post('/api/user')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(res.body.error).toContain('User validation failed: username: Error, expected `username` to be unique')

    const userAtEnd = await getUsers()
    expect(userAtEnd).toHaveLength(userAtStart.length)
  })

  afterAll(() => {
    mongoose.disconnect()
    server.close()
  })
})

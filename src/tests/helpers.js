
const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/user')
const initialEvents = [
  {
    title: 'esto es un test',
    description: 'testeo de ciertas funcionalidades',
    place: {
      codlocalidad: 2,
      nombrelocalidad: 'Catamarca',
      Direccion: 'plaza 25 Agosto'
    },
    date: new Date(),
    important: true,
    urlimage: 'http://unsitioconimagenes/id',
    user: '61152a74eff3a429a44b5397'
  },
  {
    title: 'esto es un test2',
    description: 'testeo de ciertas funcionalidades por segunda vez',
    place: {
      codlocalidad: 2,
      nombrelocalidad: 'Catamarca',
      Direccion: 'plaza 25 Agosto'
    },
    date: new Date(),
    important: true,
    urlimage: 'http://unsitioconimagenes/id',
    user: '61152a74eff3a429a44b5397'
  }

]

const getAllTitlesFromEvents = async () => {
  const res = await api.get('/api/event')
  return {
    titles: res.body.map(evento => evento.title),
    res
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

module.exports = {
  initialEvents,
  api,
  getAllTitlesFromEvents,
  getUsers
}

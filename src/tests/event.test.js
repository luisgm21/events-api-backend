const supertest = require('supertest')
const { app, server } = require('../index')
const mongoose = require('mongoose')
const Evento = require('../models/event')
const api = supertest(app)

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
    urlimage: 'http://unsitioconimagenes/id'
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
    urlimage: 'http://unsitioconimagenes/id'
  }

]

test('notes are returned as json', async () => {
  await api
    .get('/api/event')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
test('there are two event', async () => {
  const res = await api.get('/api/event')
  expect(res.body).toHaveLength(initialEvents.length)
})

beforeEach(async () => {
  await Evento.deleteMany({})
  const nota1 = new Evento(initialEvents[0])
  nota1.save()
  const nota2 = new Evento(initialEvents[1])
  nota2.save()
})

afterAll(() => {
  mongoose.disconnect()
  server.close()
})

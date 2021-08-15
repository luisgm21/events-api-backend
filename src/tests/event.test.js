const { server } = require('../index')
const mongoose = require('mongoose')
const { initialEvents, api, getAllTitlesFromEvents } = require('./helpers')
const Evento = require('../models/event')
describe('GET  all events', () => {
  test('event are returned as json', async () => {
    await api
      .get('/api/event')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two event', async () => {
    const res = await api.get('/api/event')
    expect(res.body).toHaveLength(initialEvents.length)
  })

  test('the title of the first event is about test ', async () => {
    const { titles } = await getAllTitlesFromEvents()

    expect(titles).toContain('esto es un test')
  })
})
describe('POST /api/event', () => {
  test('a valid event can be added', async () => {
    const newEvento = {
      title: 'Ajedrez en pileta',
      description: 'ajedrez debajo del agua',
      place: {
        codlocalidad: 2,
        nombrelocalidad: 'Catamarca',
        Direccion: 'Plaza Alameda'
      },
      date: new Date(),
      important: true,
      urlimage: 'http://unsitioconimagenes/id',
      user: '61152a74eff3a429a44b5397'
    }

    await api
      .post('/api/event')
      .send(newEvento)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const { titles, res } = await getAllTitlesFromEvents()

    expect(res.body).toHaveLength(initialEvents.length + 1)
    expect(titles).toContain(newEvento.title)
  })

  test('event without title is not added', async () => {
    const newEvento = {
      description: 'ajedrez debajo del agua',
      place: {
        codlocalidad: 2,
        nombrelocalidad: 'Catamarca',
        Direccion: 'Plaza Alameda'
      },
      date: new Date(),
      important: true,
      urlimage: 'http://unsitioconimagenes/id',
      user: '61152a74eff3a429a44b5397'
    }

    await api
      .post('/api/event')
      .send(newEvento)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const res = await api.get('/api/event')

    expect(res.body).toHaveLength(initialEvents.length)
  })
})

describe('DELETE /api/event', () => {
  test('a event can be delete', async () => {
    const { res: firstRes } = await getAllTitlesFromEvents()
    const { body: eventos } = firstRes
    const eventoToDelete = eventos[0]

    await api
      .delete(`/api/event/${eventoToDelete.id}`)
      .expect(204)

    const { titles, res: secondRes } = await getAllTitlesFromEvents()
    expect(secondRes.body).toHaveLength(initialEvents.length - 1)
    expect(titles).not.toContain(eventoToDelete.title)
  })

  test('a event do  not exist can not be delete', async () => {
    await api
      .delete('/api/event/1234')
      .expect(400)

    const { res } = await getAllTitlesFromEvents()
    expect(res.body).toHaveLength(initialEvents.length)
  })
})

beforeEach(async () => {
  await Evento.deleteMany({})

  for (const evento of initialEvents) {
    const eventoObject = new Evento(evento)
    await eventoObject.save()
  }
})

afterAll(() => {
  mongoose.disconnect()
  server.close()
})

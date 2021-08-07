const express = require('express')
const morgan = require('morgan')
const app = express()

// settings
app.set('port', process.env.PORT || 3000)
// Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found'
  })
})
// Routes
app.use('/api/event', require('./routes/event.routes'))

// starting server
app.listen(app.get('port'), () => {
  console.log(`server conectado en puerto ${app.get('port')}`)
})

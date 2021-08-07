const express = require('express')
const morgan = require('morgan')
const path = require('path')
const app = express()

// settings
app.set('port', process.env.PORT || 3000)
// Middlewares
app.use(morgan('dev'))
app.use(express.json())

// Routes
app.use('/api/event', require('./routes/event.routes'))
// Static files
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found'
  })
})
// starting server
app.listen(app.get('port'), () => {
  console.log(`server conectado en puerto ${app.get('port')}`)
})

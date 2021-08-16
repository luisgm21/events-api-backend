require('dotenv').config()
const express = require('express')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const morgan = require('morgan')
const path = require('path')
const handlerError = require('./middlewares/handlerError')
const notFound = require('./middlewares/notFound')
// eslint-disable-next-line no-unused-vars
const { db } = require('./database')
const app = express()

// settings
app.set('port', process.env.PORT)
// Middlewares
app.use(morgan('dev'))
app.use(express.json())

Sentry.init({
  dsn: 'https://ded8c1f6b0714986a9448033a7e1962c@o949032.ingest.sentry.io/5897978',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})
// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

// Routes
app.use('/api/event', require('./controllers/event'))
app.use('/api/user', require('./controllers/user'))
app.use('/api/login', require('./controllers/login'))
// Static files
app.use(express.static(path.join(__dirname, 'public')))

app.use(notFound)
// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())
app.use(handlerError)
// starting server
const server = app.listen(app.get('port'), () => {
  console.log(`server conectado en puerto ${app.get('port')}`)
})

module.exports = { app, server }

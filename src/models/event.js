const { lugar } = require('./eventlugar')
const { Schema, model } = require('mongoose')

const eventSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  place: lugar,
  important: {
    type: Boolean,
    default: false
  },
  urlimg: String
})

eventSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const event = model('Event', eventSchema)

module.exports = event

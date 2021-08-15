module.exports = (err, req, res, next) => {
  console.error(err)
  console.log(err.name)
  if (err.name === 'CastError') {
    res.status(400).send({ Error: 'id use is malformed' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json(err.message)
  } else if (err.name === 'MongoError') {
    return res.status(400).json({ error: err.message })
  } else {
    res.status(500).end()
  }
}

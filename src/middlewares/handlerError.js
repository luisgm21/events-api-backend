module.exports = (err, req, res, next) => {
  console.error(err)
  console.log(err.name)
  if (err.name === 'CastError') {
    res.status(400).send({ Error: 'id use is malformed' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  } else if (err.name === 'ValidationError') {
    return res.status(409).json(err.message)
  } else if (err.name === 'MongoError') {
    return res.status(400).json({ error: err.message })
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  } else {
    res.status(500).end()
  }
}

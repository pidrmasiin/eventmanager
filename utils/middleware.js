 const buildIndex = (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
}

const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }


const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
}

module.exports = {
    buildIndex,
    error,
    getTokenFrom,
  }
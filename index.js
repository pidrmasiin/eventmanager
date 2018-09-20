const http = require('http')
const path = require('path')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./utils/config')
const middleware = require('./utils/middleware')


const loginRouter = require('./controllers/login')
const userRouter = require('./controllers/user')
const eventRouter = require('./controllers/event')

mongoose.connect(config.mongoUrl, { useNewUrlParser: true })
mongoose.Promise = global.Promise

app.use(cors())
app.use(bodyParser.json())

app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/events', eventRouter)
app.use('/', express.static('build'))

app.use(middleware.error)

const server = http.createServer(app)

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
  })
  
server.on('close', () => {
    mongoose.connection.close()
  })
  
module.exports = {
    app, server
}
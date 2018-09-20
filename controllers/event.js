const eventRouter = require('express').Router()
const Event = require('../models/event')
const User = require('../models/user')
const middleware = require('../utils/middleware')
const jwt = require('jsonwebtoken')


eventRouter.get('/', async (request, response) => {
  // try{
  //   const token = middleware.getTokenFrom(request)
  //   const decodedToken = jwt.verify(token, process.env.SECRET)
  //   if (!token || !decodedToken.id) {
  //     return response.status(401).json({ error: 'token missing or invalid' })
  //   }
    const events = await Event
      .find({})
    response.json(events.map(Event.format))
  // }catch (exception) {
  //   console.log(exception)
  //   response.status(400).json({ error: 'cant find event' })
  // }
})

eventRouter.get('/:id', async (request, response) => {
  try{
    const token = middleware.getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const event = await Event
      .findById(request.params.id)
    response.json(Event.format(event))
  }catch (exception) {
    console.log(exception)
    response.status(400).json({ error: 'cant find event' })
  }
})

eventRouter.post('/', async (request, response) => {
    const body = request.body
    console.log('body')
    try{
      const token = middleware.getTokenFrom(request)
      const decodedToken = jwt.verify(token, process.env.SECRET)
      if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }
      const event = new Event(body)
  
     
      await event.save()
      response.json(Event.format(event))
    } catch (exception) {
      if (exception.name === 'JsonWebTokenError' ) {
        response.status(401).json({ error: exception.message })
      } else {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...' })
      }
    }
  })

eventRouter.delete('/:id', async (request, response) => {
    try{
      const token = middleware.getTokenFrom(request)
      const decodedToken = jwt.verify(token, process.env.SECRET)
      if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }
      // request.body form must be => {status: "", id: ""}
      const event = await Event.findById(request.params.id)
      event.participants.forEach(async e => {
        const user = await User.findById(e.user)
        user.events = user.events.filter(x => x.event != request.params.id.toString())
        user.save()
      });
      await Event.findByIdAndDelete(request.params.id)
      response.status(204).end()
    } catch (exception) {
      if (exception.name === 'JsonWebTokenError' ) {
        response.status(401).json({ error: exception.message })
      } else {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...' })
      }
    }
  })

module.exports = eventRouter
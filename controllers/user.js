const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')
const Event = require('../models/event')
const middleware = require('../utils/middleware')
const jwt = require('jsonwebtoken')


userRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users.map(User.format))
})

userRouter.get('/:id', async (request, response) => {
  try{
    const user = await User
      .findById(request.params.id)
    response.json(User.format(user))
  }catch (exception) {
    console.log(exception)
    response.status(400).json({ error: 'cant find user' })
  }
})

userRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const existingUser = await User.find({ username: body.username })
    if (existingUser.length > 0) {
      return response.status(400).json({ error: 'username must be unique' })
    }if (body.password.length < 3) {
      return response.status(400).json({ error: 'password must contain at least 3 characters' })
    }if(!body.adult){
      body.adult = true
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      passwordHash,
    })

    const savedUser = await user.save()
    response.json(User.format(savedUser))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

userRouter.put('/:id', async (request, response) => {
  try{
    const token = middleware.getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    // request.body form must be => {status: "", id: ""}
    const event = request.body
    const userToEdit = await User.findById(request.params.id)
    const eventInDB = await Event.findById(event.id)

    const newUser = { 
      status: event.status,
      user: userToEdit
    }

    const participants = eventInDB.participants.map(x => x.user.toString())
    if(participants.includes(request.params.id)){
      const index = participants.findIndex(x => x === request.params.id)
      eventInDB.participants[index] = newUser
      await eventInDB.save()
    } else {
      eventInDB.participants.push(newUser)
      await eventInDB.save()
    } 

    const events = userToEdit.events.map(x => x.event.toString())
    if(events.includes(eventInDB.id)){
      const index = events.findIndex(x => x === eventInDB.id)
      userToEdit.events[index] = { status: event.status, event: eventInDB }
      await userToEdit.save()
    } else {
      userToEdit.events.push({ status: event.status, event: eventInDB })
      await userToEdit.save()
    }

    response.json("event added").end()
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong...' })
    }
  }
})





module.exports = userRouter
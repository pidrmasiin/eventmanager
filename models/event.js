const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  name: String,
  details: String,
  startTime: Date,
  endTime: Date,
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  participants: [{ 
    status: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
   }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
})

eventSchema.statics.format = (event) => {
  return{
    id: event._id,
    name: event.name,
    details: event.details,
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location,
    participants: event.participants,
    comments: event.comments,
  }
}

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
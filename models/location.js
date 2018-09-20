const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
  city: String,
  address: String,
  phone: Number, 
  web: String, 
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
})

locationSchema.statics.format = (location) => {
  return{
    id: location._id,
    city: location.city,
    address: location.address,
    participants: location.participants,
    comments: location.comments,
  }
}

const Location = mongoose.model('Location', locationSchema)

module.exports = Location
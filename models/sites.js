const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sitesSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  assignedUser: { type: Schema.Types.ObjectId, ref: 'users' },
  createdAt: { type: Date, default: Date.now },
  Profil: { type: Schema.Types.ObjectId, ref: 'DimmingProfile' },
});

module.exports = mongoose.model('sites', sitesSchema);
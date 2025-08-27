const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dimmingProfileSchema = new Schema({
  Title: { type: String, required: true },
  Time: { type: Array }, // Array of time strings or objects
  Lampe_level: { type: Array }, // Array of levels
  Periodic: { type: Number },
  Annual: { type: Number },
  UserId: { type: Schema.Types.ObjectId, ref: 'users' },
  AjusterProfId: { type: Schema.Types.ObjectId, ref: 'AjusterProf' },
  SupprimerProfId: { type: Schema.Types.ObjectId, ref: 'SupprimerProf' },
  ModifierProfId: { type: Schema.Types.ObjectId, ref: 'ModifierProf' },
  ConsulterProfId: { type: Schema.Types.ObjectId, ref: 'ConsulterProf' },
  AfficherProfId: { type: Schema.Types.ObjectId, ref: 'AfficherProf' },
});

module.exports = mongoose.model('dimmingprofiles', dimmingProfileSchema);
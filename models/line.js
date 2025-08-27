const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lineSchema = new Schema({
  Id: { type: String, required: true },
  Name: { type: String, required: true },
  Description: { type: String },
  Device: { type: Array, ref: 'Device' },
  Profil: { type: Schema.Types.ObjectId, ref: 'DimmingProfile' },
  AjusterLineId: { type: Schema.Types.ObjectId, ref: 'AjusterLine' },
  SupprimerLineId: { type: Schema.Types.ObjectId, ref: 'SupprimerLine' },
  ModifierLineId: { type: Schema.Types.ObjectId, ref: 'ModifierLine' },
  ConsulterLineId: { type: Schema.Types.ObjectId, ref: 'ConsulterLine' },
  ControllerLineId: { type: Schema.Types.ObjectId, ref: 'ControllerLine' },
});

module.exports = mongoose.model('lines', lineSchema);
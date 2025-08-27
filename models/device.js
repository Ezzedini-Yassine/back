const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
  Id: { type: String, required: true },
  Name: { type: String, required: true },
  Description: { type: String },
  Longitude: { type: Number, required: true },
  Latitude: { type: Number, required: true },
  Status: { type: String },
  Data: { type: Array },
  Alert: { type: Number },
  Type: { type: String },
  UserId: { type: Schema.Types.ObjectId, ref: 'users' },
  SiteId: { type: Schema.Types.ObjectId, ref: 'sites' },
  LineId: { type: Schema.Types.ObjectId, ref: 'lines' },
  Profil: { type: Schema.Types.ObjectId, ref: 'dimmingprofiles' },
  AjusterDeviceId: { type: Schema.Types.ObjectId, ref: 'AjusterDevice' },
  SupprimerDeviceId: { type: Schema.Types.ObjectId, ref: 'SupprimerDevice' },
  ModifierDeviceId: { type: Schema.Types.ObjectId, ref: 'ModifierDevice' },
  ConsulterDeviceId: { type: Schema.Types.ObjectId, ref: 'ConsulterDevice' },
  ControllerDeviceId: { type: Schema.Types.ObjectId, ref: 'ControllerDevice' },
});

module.exports = mongoose.model('devices', deviceSchema);
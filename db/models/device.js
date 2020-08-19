let mongoose = require('mongoose');
let deviceSchema = new mongoose.Schema({
    license_plate: {type:String, unique : true}, 
    driver: {type:String} ,
    blueprint_id : {type: mongoose.Schema.Types.ObjectId, ref:"Blueprint"},
    timestamp: { type: Date, default: Date.now }
});
let Device = mongoose.model('Device', deviceSchema);
module.exports = Device;
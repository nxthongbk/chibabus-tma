let mongoose = require('mongoose');
let busCounterSchema = new mongoose.Schema({
    state: {type:String}, 
    image: String,
    lat: Number,
    long: Number,
    age: {type:Number, min:0, max:150},
    gender: Boolean, // male is true, female is false
    timestamp: { type: Date, default: Date.now },
    device_id : {type: mongoose.Schema.Types.ObjectId, ref:'Device'}
});

let BusCounter = mongoose.model('BusCounter', busCounterSchema);

module.exports = BusCounter;
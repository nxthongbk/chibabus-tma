let mongoose = require('mongoose');
const validator = require('validator');
let blueprintSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    name: {type: String},
    data : {
        media: [{type:"String"}],
        redirect_link: {
            type:String,
            validate: value => {
                if (!validator.isURL(value)) {
                    throw new Error({ error: 'Redirect is not a url' })
                }
            }
        },
        restricted_domain: [String],
        restricted_service: [String],
        max_clients: Number,
        session_timeout: Number,
        auth_idle_timeout: Number
    }
});

let Blueprint = mongoose.model('Blueprint', blueprintSchema);

module.exports = Blueprint;
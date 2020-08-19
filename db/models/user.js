let mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
let userSchema = new mongoose.Schema({
    email: {
        type:String, 
        unique : true, 
        required:true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: 'Invalid Email address' })
            }
        }
    }, 
    password: {
        type:String,
        minlength: 7,
        required:true
    }, 
    name: String,
    timestamp: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) return null;
    const isPasswordMatch = await bcrypt.compareSync(password, user.password)
    if (!isPasswordMatch) return null;
    return user
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id }, process.env.PRIVATE_KEY, { expiresIn: process.env.TOKEN_EXPIRE })
    return token
}

let User = mongoose.model('User', userSchema);

module.exports = User;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: Number,
    username: {
        type: String,
        required: [true, "Username must be defined"],
        unique: true,
    },

    password: {
        type: String,
        required: true,
        select: false
    }
})


// encrypt password
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    // hash the password with bcrypt
    this.password = await bcrypt.hash(this.password, 12)
    next();
})

userSchema.methods.correctPassword = async function(providePassword, userPassword){
    return await bcrypt.compare(providePassword, userPassword);
}

const User = mongoose.model('User', userSchema)
module.exports = User;
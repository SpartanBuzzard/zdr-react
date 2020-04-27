const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength:3
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength:8
    },
    userlevel: {
        type: String,
        required: true,
        default: 'user',
        trim: true
    }
},  {
        timestamps: true,
});
userSchema.methods.getFullName = function() {
    //Check supplied password against stored password
    return this.firstname + ' ' + this.lastname;
}
userSchema.methods.authenticate = function(pass) {
    //Check supplied password against stored password
    return this.password === pass;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
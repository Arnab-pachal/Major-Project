const { required } = require("joi");
const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email:{type:String,
        required:true,
    },
    image : {
        url:String,
        filename:String,
        },
})
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
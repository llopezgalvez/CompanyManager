import { Schema, model } from 'mongoose'

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Enter your name']
    },
    lastName: {
        type: String,
        required: [true, 'Enter your last name']
    },
    mail: {
        type: String,
        unique: true,
        required: [true, 'Enter your email']
    },
    phone: {
        type: String,
        minLength: [8, 'Enter at least 8 digits'],
        maxLength: [8, 'Enter up to 8 digits'],
        unique: true,
        required: [true, 'Enter your phone']
    },
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'Enter your username']
    },
    password: {
        type: String,
        required: [true, 'Enter your password']
    },
    role: {
        type: String,
        default: 'ADMIN'
    }
},{
    versionKey: false
})

export default model('user', userSchema)
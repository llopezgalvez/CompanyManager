import {Schema, model} from 'mongoose'

const categorySchema = new Schema({
    nameCategory:{
        type: String,
        unique: true,
        required: [true, 'The name already exists']
    },
    description:{
        type: String,
        required: [true, 'Enter the category description']
    }
},{
    versionKey: false
})

export default model('category', categorySchema)
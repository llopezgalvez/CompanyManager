import {Schema, model} from 'mongoose'

const companySchema = new Schema({
    nameCompany:{
        type: String,
        required: [true, 'Enter your company name']
    },
    ImpactLevel:{
        type: String,
        required: [true, 'Enter your impact level']
    },
    yearsOfTrajectory:{
        type: Number,
        required: [true, 'Enter your years of trajectory']
    },
    businessCategory:{
        type: Schema.ObjectId,
        ref: 'category',
        required: [true, 'Enter your business category']
    }
},{
    versionKey: false
})

export default model('company', companySchema)
import mongoose, {Schema} from 'mongoose'

const instructorSchema = new Schema( {
    name:{
        type:String,
        required:true,
        index: true,
    },
    instructorId:{
        type:String,
        required:true,
        unique:true,
    }
}, {timestamps: true} )


export const Instructor = mongoose.model( "Instructor", instructorSchema )
import mongoose, {Schema} from 'mongoose'

const meetingSchema = new Schema( {
    startTime: {
        type: String,
        required: true 
    },
    endTime: {
        type: String,
        required: true 
    }
}, {timestamps: true} )


export const Meeting = mongoose.model( "Meeting", meetingSchema )
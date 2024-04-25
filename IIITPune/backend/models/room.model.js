import mongoose, {Schema} from 'mongoose'

const roomSchema = new Schema( {
    capacity: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        }
    },
    roomId: {
        type: String,
        required: true,
        unique: true,
    }
}, {timestamps: true} )


export const Room = mongoose.model( "Room", roomSchema )
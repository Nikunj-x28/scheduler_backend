import mongoose, {Schema} from 'mongoose'

const courseSchema = new Schema( {
    name: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    courseId: {
        type: String,
        required: true,
        unique: true,
    },
    instructor: {
        type: Schema.Types.ObjectId,
        ref: 'Instructor',
        required: true
    },
    credit: {
        type: Number,
        required: true,
    }
}, {timestamps: true} )


export const Course = mongoose.model( "Course", courseSchema )
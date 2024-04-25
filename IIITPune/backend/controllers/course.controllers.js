import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {Course} from "../models/course.model.js";
import {Instructor} from "../models/instructor.model.js";


const setCourse = asyncHandler( async ( req, res ) =>
{
    const {name, courseId, instructorname, credit} = req.body
    // console.log( req.body )
    if ( !credit )
    {
        throw new ApiError( 400, "All fields required" )
    }
    if ( [ name, courseId, instructorname ].some( ( field ) => field?.trim() === '' ) )
    {
        throw new ApiError( 400, "All fields required" )
    }

    const existedCourse = await Course.findOne( {courseId} )
    if ( existedCourse )
    {
        throw new ApiError( 409, "Course already exist" )
    }

    const instructorQ = await Instructor.findOne( {name: instructorname} );
    const instructor = instructorQ._id;
    const course = await Course.create( {
        name, courseId, instructor, credit
    } )
    // console.log( course );
    const createdCourse = await Course.findById( course._id )
    // console.log(createdCourse)
    if ( !createdCourse )
    {
        throw new ApiError( 500, "Something went wrong while registering" )
    }

    return res.status( 201 ).json(
        new ApiResponse( 200, createdCourse, "Course Registered" )
    )
} )

export
{
    setCourse
}
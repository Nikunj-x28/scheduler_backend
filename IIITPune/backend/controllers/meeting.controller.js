import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { Meeting } from "../models/meeting.model.js";


const setTime = asyncHandler( async ( req, res ) =>
{
    const {startTime, endTime} = req.body
    if ( [ startTime,endTime].some( ( field ) => field?.trim() === '' ) )
    {
        throw new ApiError( 400, "All fields required" )
    }

    const meeting = await Meeting.create( {
        startTime, endTime
    } )
    const createdTime = await Meeting.findById( meeting._id )
    // console.log(createdTime)
    if ( !createdTime )
    {
        throw new ApiError( 500, "Something went wrong while registering time" )
    }

    return res.status( 201 ).json(
        new ApiResponse( 200, createdTime, "Time Registered" )
    )
} )

export
{
    setTime
}
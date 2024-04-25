import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { Room } from "../models/room.model.js";


const setRoom = asyncHandler( async ( req, res ) =>
{
    const {roomId,capacity} = req.body
    if ( [ roomId].some( ( field ) => field?.trim() === '' ) )
    {
        throw new ApiError( 400, "All fields required" )
    }

    const existedRoom = await Room.findOne( {roomId} )
    if ( existedRoom )
    {
        throw new ApiError( 409, "Room already exist" )
    }
    const room = await Room.create( {
        capacity, roomId
    } )
    const createdRoom = await Room.findById( room._id )
    // console.log(createdRoom)
    if ( !createdRoom )
    {
        throw new ApiError( 500, "Something went wrong while registering" )
    }

    return res.status( 201 ).json(
        new ApiResponse( 200, createdRoom, "Room Registered" )
    )
} )

export
{
    setRoom
}
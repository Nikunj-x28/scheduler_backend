import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {Room} from "../models/room.model.js";
import {Instructor} from "../models/instructor.model.js";
import {Course} from "../models/course.model.js";
import {Section} from "../models/section.model.js";
import {Meeting} from "../models/meeting.model.js";
import {Department} from "../models/department.model.js";

const getRooms = asyncHandler( async ( req, res ) =>
{
    const existedRooms = await Room.find();
    if ( !existedRooms )
    {
        throw new ApiError( 404, "No rooms present" )
    }
    return res.status( 201 ).json(
        new ApiResponse( 200, existedRooms )
    )
} )

const getInstructors = asyncHandler( async ( req, res ) =>
{
    const existedinstructors = await Instructor.find();
    if ( !existedinstructors )
    {
        throw new ApiError( 404, "No instructors present" );
    }
    return res.status( 201 ).json(
        new ApiResponse( 200, existedinstructors )
    )
} )

const getCourses = asyncHandler( async ( req, res ) =>
{
    const existedcourses = await Course.find().populate( 'instructor' );
    if ( !existedcourses )
    {
        throw new ApiError( 404, "No courses present" );
    }
    return res.status( 201 ).json(
        new ApiResponse( 200, existedcourses )
    )
} )

const getSections = asyncHandler( async ( req, res ) =>
{
    const existedsections = await Section.find().populate( 'departmentName' );
    if ( !existedsections )
    {
        throw new ApiError( 404, "No sections present" );
    }
    return res.status( 201 ).json(
        new ApiResponse( 200, existedsections )
    )
} )

const getMeetings = asyncHandler( async ( req, res ) =>
{
    const existedmeetings = await Meeting.find();
    if ( !existedmeetings )
    {
        throw new ApiError( 404, "No meetings present" );
    }
    return res.status( 201 ).json(
        new ApiResponse( 200, existedmeetings )
    )
} )

const getDepartments = asyncHandler( async ( req, res ) =>
{
    const existeddepartments = await Department.find().populate( 'courses' );
    if ( !existeddepartments )
    {
        throw new ApiError( 404, "No meetings present" );
    }
    return res.status( 201 ).json(
        new ApiResponse( 200, existeddepartments )
    )
} )



export
{
    getRooms,
    getInstructors,
    getCourses,
    getSections,
    getMeetings,
    getDepartments,
}
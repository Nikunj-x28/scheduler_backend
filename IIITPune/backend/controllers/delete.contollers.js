import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {Room} from "../models/room.model.js";
import {Instructor} from "../models/instructor.model.js";
import {Course} from "../models/course.model.js";
import {Section} from "../models/section.model.js";
import {Meeting} from "../models/meeting.model.js";
import {Department} from "../models/department.model.js";

const deleteRooms = asyncHandler( async ( req, res ) =>
{
    const {roomId} = req.body
    const deletedRoom = await Room.findOneAndDelete( {roomId: roomId} )
    if ( !deletedRoom )
    {
        throw new ApiError( 409, "Something went wrong while deleting" )
    }
    return res.status( 201 ).json(
        new ApiResponse( 200, deletedRoom, "Room deleted" )
    )
} )

const deleteInstructors = asyncHandler( async ( req, res ) =>
{
    const {id, instructorId} = req.body
    const deletedcourse = await Course.deleteMany( {instructor: id} )
    const deletedinstructor = await Instructor.findOneAndDelete( {instructorId: instructorId} )
    if ( !deletedinstructor )
    {
        throw new ApiError( 409, "Something went wrong while deleting" )
    }
    return res.status( 201 ).json(
        new ApiResponse( 200,deletedcourse, deletedinstructor, "Instructor deleted" )
    )
} )

const deleteCourses = asyncHandler( async ( req, res ) =>
{
    const {courseId} = req.body
    const deletedcourse = await Course.findOneAndDelete( {courseId: courseId} )
    if ( !deletedcourse )
    {
        throw new ApiError( 409, "Something went wrong while deleting" )
    }
    return res.status( 201 ).json(
        new ApiResponse( 200, deletedcourse, "Course deleted" )
    )
} )

const deleteSections = asyncHandler( async ( req, res ) =>
{
    const {sectionId} = req.body
    const deletedsection = await Section.findOneAndDelete( {sectionId: sectionId} )
    if ( !deletedsection )
    {
        throw new ApiError( 409, "Something went wrong while deleting" )
    }
    return res.status( 201 ).json(
        new ApiResponse( 200, deletedsection, "Section deleted" )
    )
} )

const deleteMeetings = asyncHandler( async ( req, res ) =>
{
    const {startTime} = req.body
    const deletedmeeting = await Meeting.findOneAndDelete( {startTime: startTime} )
    if ( !deletedmeeting )
    {
        throw new ApiError( 409, "Something went wrong while deleting" )
    }
    return res.status( 201 ).json(
        new ApiResponse( 200, deletedmeeting, "Meeting deleted" )
    )
} )

const deleteDepartments = asyncHandler( async ( req, res ) =>
{
    const {departmentId} = req.body
    const department = await Department.findOne( {departmentId} )
    const deletedSections = await Section.deleteMany( {departmentName: department._id} )
    const deleteddepartment = await Department.findOneAndDelete( {departmentId: departmentId} )
    if ( !deleteddepartment )
    {
        throw new ApiError( 409, "Something went wrong while deleting" )
    }
    return res.status( 201 ).json(
        new ApiResponse( 200, deletedSections ,deleteddepartment, "Department deleted" )
    )
} )

export
{
    deleteRooms,
    deleteInstructors,
    deleteCourses,
    deleteSections,
    deleteMeetings,
    deleteDepartments
}
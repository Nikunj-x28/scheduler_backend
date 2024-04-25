import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {Room} from "../models/room.model.js";
import {Instructor} from "../models/instructor.model.js";
import {Course} from "../models/course.model.js";
import {Section} from "../models/section.model.js";
import {Meeting} from "../models/meeting.model.js";
import { Department } from "../models/department.model.js";

const updateRooms = asyncHandler( async ( req, res ) =>
{
    const {roomId, capacity} = req.body
    const updatedRoom = await Room.findOneAndUpdate( {roomId: roomId}, {capacity: capacity}, {new: true} )
    if ( !updatedRoom )
    {
        throw new ApiError( 409, "Something went wrong while updating" )
    }
    return res.status( 201 ).json(
        new ApiResponse( 200, updatedRoom, "Room updated" )
    )
} )

const updateInstructors = asyncHandler( async ( req, res ) =>
{
    const {instructorId, name} = req.body
    const updatedinstructor = await Instructor.findOneAndUpdate( {instructorId: instructorId}, {name: name}, {new: true} )
    if ( !updatedinstructor )
    {
        throw new ApiError( 409, "Something went wrong while updating" )
    }
    return res.status( 201 ).json(
        new ApiResponse( 200, updatedinstructor, "Instructor updated" )
    )
} )

const updateCourses = asyncHandler( async ( req, res ) =>
{
    const {name, courseId, instructorname, credit} = req.body
    // console.log(req.body)
    const course = await Course.find( {courseId} );
    const oldInstructorId = course[ 0 ]?.instructor.toString()
    // console.log(oldInstructorId)
    const updatedInstructor = await Instructor.findOneAndUpdate( {_id: oldInstructorId}, {name: instructorname}, {new: true} )
    // console.log(updatedInstructor)
    const updatedcourse = await Course.findOneAndUpdate( {courseId: courseId}, {name: name, instructor: updatedInstructor?._id, credit: credit}, {new: true} )
    if ( !updatedcourse )
    {
        throw new ApiError( 409, "Something went wrong while updating" )
    }
    return res.status( 201 ).json(
        new ApiResponse( 200, updatedcourse, "Course updated" )
    )
} )

const updateSections = asyncHandler( async ( req, res ) =>
{
    const {sectionId, capacity,departmentName} = req.body
    const deptId=await Department.findOne({departmentName})
    const department=deptId._id

    const updatedsection = await Section.findOneAndUpdate( {sectionId: sectionId}, {capacity: capacity,departmentName:department}, {new: true} )
    if ( !updatedsection )
    {
        throw new ApiError( 409, "Something went wrong while updating" )
    }
    return res.status( 201 ).json(
        new ApiResponse( 200, updatedsection, "Section updated" )
    )
} )

const updateMeetings = asyncHandler( async ( req, res ) =>
{
    const {startTime, endTime} = req.body
    const updatedmeeting = await Meeting.findOneAndUpdate( {startTime: startTime}, {startTime: startTime, endTime: endTime}, {new: true} )
    if ( !updatedmeeting )
    {
        throw new ApiError( 409, "Something went wrong while updating" )
    }
    return res.status( 201 ).json(
        new ApiResponse( 200, updatedmeeting, "Meeting updated" )
    )
} )

export
{
    updateRooms,
    updateInstructors,
    updateCourses,
    updateSections,
    updateMeetings
}
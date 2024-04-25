import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {Department} from "../models/department.model.js";
import {Course} from "../models/course.model.js";


const setdepartment = asyncHandler( async ( req, res ) =>
{
    const {departmentName, departmentId, courses} = req.body

    if ( courses.length === 0 )
    {
        throw new ApiError( 400, "All fields required" )
    }
    if ( [ departmentId, departmentName ].some( ( field ) => field?.trim() === '' ) )
    {
        throw new ApiError( 400, "All fields required" )
    }

    const existedDepartment = await Department.findOne( {departmentId} )
    if ( existedDepartment )
    {
        throw new ApiError( 409, "Department already exist" )
    }

    const coursearray = [];
    async function processCourses ()
    {
        try
        {
            for ( const coursename of courses )
            {
                const course = await Course.findOne( {name: coursename} );
                if ( course )
                {
                    coursearray.push( course._id );
                }
            }
        } catch ( error )
        {
            throw new ApiError( 409, "Error processing courses" )
        }
    }
    await processCourses();

    const department = await Department.create( {
        departmentName, departmentId, courses: coursearray
    } )
    const createdDepartment = await Department.findById( department._id )
    // console.log(createdDepartment)
    if ( !createdDepartment )
    {
        throw new ApiError( 500, "Something went wrong while registering" )
    }

    return res.status( 201 ).json(
        new ApiResponse( 200, createdDepartment, "Department Registered" )
    )
} )

export
{
    setdepartment
}
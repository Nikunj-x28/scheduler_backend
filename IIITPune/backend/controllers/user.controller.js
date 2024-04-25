import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js";
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshTokens = async ( userId ) =>
{
    try
    {
        const user = await User.findById( userId )
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save( {validateBeforeSave: false} )
        return {accessToken, refreshToken}
    } catch ( error )
    {
        throw new ApiError( 500, "Something went wrong while generating tokens" )
    }
}

const registerUser = asyncHandler( async ( req, res ) =>
{
    const {fullName, email, password} = req.body
    if ( [ fullName, email, password ].some( ( field ) => field?.trim() === '' ) )
    {
        throw new ApiError( 400, "All fields required" )
    }

    const existedUser = await User.findOne( {email} )
    if ( existedUser )
    {
        throw new ApiError( 409, "User already exist" )
    }
    const user = await User.create( {
        fullName, email, password
    } )
    const createdUser = await User.findById( user._id ).select( "-password -refreshToken" )
    if ( !createdUser )
    {
        throw new ApiError( 500, "Something went wrong while registering" )
    }

    return res.status( 201 ).json(
        new ApiResponse( 200, createdUser, "User Registered" )
    )
} )

const loginUser = asyncHandler( async ( req, res ) =>
{
    const {fullName, email, password} = req.body
    if ( !email )
    {
        throw new ApiError( 400, "Email required" )
    }
    const user = await User.findOne( {email} )

    if ( !user )
    {
        throw new ApiError( 404, "User doesnot exist" )
    }

    const isPasswordValid = await user.isPasswordCorrect( password )
    if ( !isPasswordValid )
    {
        throw new ApiError( 401, "Password incorrect" )
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens( user._id )

    const loggedInUser = await User.findById( user._id ).select( "-password -refreshToken" )

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status( 200 ).cookie( "accessToken", accessToken, options )
        .cookie( "refreshToken", refreshToken, options ).json(
            new ApiResponse( 200, {
                user: loggedInUser, accessToken, refreshToken
            },
                "User logged in successfully"
            )
        )
} )

const logoutUser = asyncHandler( async ( req, res ) =>
{
    await User.findByIdAndUpdate(
        req?.user?._id,
        {
            $unset: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status( 200 ).clearCookie( "accessToken", options )
        .clearCookie( "refreshToken", options )
        .json( new ApiResponse( 200, {}, "User logged out" ) )
} )

const refreshAccessToken = asyncHandler( async ( req, res ) =>
{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if ( !incomingRefreshToken )
    {
        throw new ApiError( 401, "Unauthorized Access" )
    }
    try
    {
        const decodedToken = jwt.verify( incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET )

        const user = await User.findById( decodedToken?._id )
        if ( !user )
        {
            throw new ApiError( 401, "Invalid refreshToken" )
        }
        if ( incomingRefreshToken !== user?.refreshToken )
        {
            throw new ApiError( 401, "Refresh Token expired" )
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const {accessToken, newrefreshToken} = await generateAccessAndRefreshTokens( user._id )

        return res.status( 200 )
            .cookie( "accessToken", accessToken, options )
            .cookie( "refreshToken", newrefreshToken, options )
            .json(
                new ApiResponse( 200, {
                    accessToken, refreshToken: newrefreshToken
                },
                    "Access Token refreshed"
                )
            )
    } catch ( error )
    {
        throw new ApiError( 401, error?.message || "Invalid refresh Token" )
    }
} )


export
{
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}
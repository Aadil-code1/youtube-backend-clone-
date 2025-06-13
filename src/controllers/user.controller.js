import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from  "../utils/apiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js"
const userRegister  = asyncHandler(async(req,res)=>{
  //get user details from frontend ,
  //validate the fields ,whether they are correct or not,
  //check if user already exists or create one 
  // check for user image ,avatar to upload on cloudinary
  // get the avatar link and create a user object in db
  // remove password and refresh token from response 
  // check user  in db and send the response that user has been created successfully

  const {username,fullName,email,password} = res.body
  console.log("email",email);

  if (
    [fullName,email,username,password].some((field)=>field?.trim() === "")
  ){
    throw new apiError(400,"All fields are required")
  }
  const existedUser = User.findOne({
    $or : [{ username }, { email }]
  })

  if (existedUser){
    throw new apiError(409,"user already exist with same username and email")
  }


  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath =  req.files?.coverImage[0]?.path

  if (avatarLocalPath) {
    throw new apiError(400,"avatar image is required ")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar){
    throw new apiError(400,"avatar image is required ")
  }
  const user = await User.create ({
    fullName,
    avatar : avatar.url,
    coverImage : coverImage?.url  || "" ,
    email,
    password, 
    username:username.toLowerCase()

  })
  const createdUser = await User.findById(user._Id).select("-password -refreshToken")

  if(!createdUser){
    throw new apiError(500, "internal server error,while registering user")
  }

  return res.status(201).json(
    new apiResponse(200, createdUser ,"user registerd successfully")
  )
  // if (fullName === ""){
  //   throw new apiError
  // }
})

export {userRegister}
import { apiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import  jwt  from "jsonwebtoken"
import { User } from "../models/user.model.js"


export const verifyJWT = asyncHandler(async (req,_ ,next) => {
  try {
    const  token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if(!token) {
      throw new apiError(401,"unauthorized request")
    }
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
  
    if(!user){
      // TODO : discuss about frontend
      throw new apiError (404,"Invalid access token")
    }
    
    req.user = user
    next()
  } catch (error) {
    throw new apiError (401, error?.message || "Invalid access token")
  }

})
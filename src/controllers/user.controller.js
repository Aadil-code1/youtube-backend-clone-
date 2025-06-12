import {asyncHandler} from "../utils/asyncHandler.js"

const userRegister  = asyncHandler(async(req,res)=>{
  res.send(200).json({
    message: "Aadil your server is working via postman"
  })
})

export {userRegister}